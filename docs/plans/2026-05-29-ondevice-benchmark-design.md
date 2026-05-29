# On-Device Benchmark: x-markdown-mini vs 业内方案

**Date:** 2026-05-29
**Status:** Design (approved via brainstorming)
**Goal:** Compare `x-markdown-mini`'s mini-program rendering performance against industry
solutions on real targets (iOS simulator + Android real device), covering both streaming
and non-streaming scenarios, measuring CPU and memory, with a fully reproducible path.

---

## 0. Why this exists (and what the existing benchmark does *not* cover)

The repo already has `benchmark/compare.ts` — a **Node/V8** tinybench comparison
(`x-markdown-mini` vs towxml vs marked vs markdown-it). That measures **JS parse/transform
throughput on a desktop V8**. It cannot measure what actually makes mini-programs janky:

- The **two-thread architecture**: `setData` payload is serialized and shipped from the
  logic thread to the render thread; large/frequent payloads are the documented root cause
  of stutter.
- **Render-layer** diff/reflow cost.
- **On-device CPU and memory** on the real silicon users run.

Industry consensus (see References) is unanimous: in mini-program markdown rendering — and
especially in AI streaming — **the bottleneck is `setData` payload size × frequency and the
render-layer cost, not JS parse time.** This benchmark therefore measures those directly.

---

## 1. Industry landscape (research summary)

Same-caliber competitors — markdown → mini-program node tree:

| Renderer | Lineage / notes | WeChat | Alipay |
|---|---|---|---|
| **x-markdown-mini** (this repo, components/NodesRenderer path) | streaming-aware: stable-block commit + tail `remend` fixup, component-isolated `setData` | ✅ | ✅ |
| **towxml** 3.0 | most active rival; markdown/HTML→WXML node tree, one-shot `setData`, highlight-on by default | ✅ | — |
| **wemark** | unmaintained; author recommends native instead. Historical reference | ✅ | — |
| **markdown-x-mini** (tnpm) | Ant-internal Alipay component (words-reversed sibling/predecessor of this repo). Install via tnpm | — | ✅ |
| **mp-html** | HTML-rich-text camp; markdown via plugin (markdown→HTML→its own html-parser→components). Cross-platform | ✅ | ✅ |
| **native `<rich-text>`** | the "do nothing custom" baseline (markdown→HTML→rich-text) | ✅ | ✅ |
| **markdown-it→HTML→mp-html** | parser-isolation column (shares mp-html render path; only the parser differs) | ✅ | ✅ |

Parse-only references (marked / markdown-it, no node tree) remain in the Node-side
`bench:compare` as a lower bound; on-device they appear only as the parse step inside the
HTML-based adapters.

**Key streaming insight:** none of the competitors has an incremental mode — they re-parse
the full cumulative text and do a full `setData` every chunk. `x-markdown-mini` commits
stable blocks and only re-processes + fixes up the tail. We measure the realistic behavior
(each renderer does its best), which is the honest production story.

---

## 2. Architecture

Harness lives under `examples/` so it is **directly openable in WeChat/Alipay DevTools and
pushable to real device** (the examples already receive `dist/` via
`scripts/copy-component-assets.mjs`). Shared logic is framework-neutral under `benchmark/`.

```
benchmark/ondevice/
  corpus.ts            # imports benchmark/samples/* as strings (single source of truth)
  metrics.ts           # timing / byte / node-count helpers (platform-neutral)
  driver.ts            # run loop: warmup -> N reps -> collect -> emit JSON
  chunks.fixture.json  # pre-tokenized streaming stream (committed, deterministic)
  adapters/
    x-markdown-mini.ts     # this repo, components path (both platforms)
    towxml.ts              # wechat only
    wemark.ts              # wechat only
    markdown-x-mini.ts     # alipay only (tnpm)
    mp-html.ts             # wechat + alipay
    native-richtext.ts     # wechat + alipay (path diverges, see §5)
    markdownit-mphtml.ts   # wechat + alipay (parser-isolation)
  results/             # committed result JSON + report.html
  README.md            # reproducible run path
  __tests__/           # harness validation (vitest)

examples/wechat/pages/bench/    # thin page importing the core
examples/alipay/pages/bench/    # thin page importing the core
```

Every adapter implements one interface:

```ts
interface RendererAdapter {
  name: string;
  version: string;                       // captured into results for reproducibility
  platforms: ('wechat' | 'alipay')[];
  htmlToNodePath?: string;               // documents the HTML->node path used (§5)
  setup(host): Promise<void>;            // register component / warm caches
  renderOnce(md: string): RenderResult;  // non-streaming
  renderStream(chunks: string[], onTick): Promise<StreamResult>;
  teardown(): void;
}
```

The page mounts **one adapter at a time** into a clean container; between contenders it
navigates away → settles (GC quiesce) → navigates back, so no renderer inherits another's
warm state. Results are written via `FileSystemManager.writeFile` (exportable from DevTools
and real device) and optionally POSTed to a localhost collector for automated runs.

---

## 3. Metrics

### 3.1 Fully reproducible in-app (primary signal)

| Metric | How captured | Meaning |
|---|---|---|
| `jsTime` | `performance.now()` (fallback `Date.now()`) around `markdown → node tree` | logic-thread CPU work |
| `setDataBytes` | `JSON.stringify(payload).length` of exactly what's pushed | **best cross-platform proxy for cross-thread cost** |
| `nodeCount` | nodes in produced tree | render-layer DOM pressure proxy |
| `renderTime` | `setData(data, cb)` call → callback fired | cross-thread + render-layer apply cost (works on `wx.setData` & `my.setData`) |

Bonus (WeChat real device): `PerformanceObserver` with `entryTypes: ['render','script']`
gives `firstRender` + per-update render entries, used to corroborate `renderTime`.

### 3.2 OS-level ground truth (§6)

True process **CPU%** and **RSS memory** are not reliably exposed to JS, so they come from
an OS-level pass. In-app, "CPU" = summed `jsTime`, "memory" = retained-data-size proxy
(JSON size of component `data` + `nodeCount`). The OS pass validates that these proxies
track reality.

---

## 4. Non-streaming protocol

For each `(renderer, sample)` on each platform:

1. Navigate to a fresh harness page instance (clean tree, no warm `data`).
2. **Warmup:** 3 discarded `renderOnce`, then ~200ms settle (GC + render quiesce).
3. **Measure N=20 reps**, each recording `jsTime`, `setDataBytes`, `nodeCount`, `renderTime`.
4. **Aggregate:** median (headline) + p95 (tail jank) + min. Discard rep 1 (cold).
5. Between renderers: navigate away → settle → back.

**Corpus** (from `benchmark/samples/markdown-it/` + long doc): headings, nested list,
tables, code fences, nested blockquote, nested emphasis, links, and `ai-chat-long.md`
(also used here as a single large one-shot).

**Fairness:**
- Code fences: towxml highlights by default (highlight.js); x-markdown-mini does not
  (highlight is an optional plugin) — recorded as a per-pair `caveat`, surfaced in report.
- Native rich-text & mp-html need `markdown → HTML` first; that conversion time is **counted
  in their `jsTime`** (real on-device work), with the converter (marked) noted.

**Headline charts:** `setDataBytes` and `renderTime` median — what users actually feel.

---

## 5. Adapter fairness contract + HTML→node paths

**Contract (credibility rests on this):**
- Same input string, same destination (a real on-screen render — harness asserts the
  container is non-empty so no adapter wins by no-op'ing).
- Measurement boundary = **string in → render-callback out** for everyone; no renderer may
  exclude a step it genuinely needs (incl. markdown→HTML for HTML-based adapters).
- Default config; every unavoidable asymmetry recorded as a per-pair `caveat`.
- Component-isolation parity: every adapter renders into its own isolated component, so
  x-markdown-mini's streaming win comes from the algorithm, not from being the only one in a
  component.
- Version pinning: exact installed versions captured into results JSON.
- Failure handling: a renderer that throws on a sample → `status: 'error'` + message
  (coverage difference is itself a finding), run continues.

**HTML → mini-program node paths (from research — there are 4; we document which each uses):**
1. `<rich-text nodes="{{htmlStr}}">` — engine's exparser/LLParser parses the HTML string,
   but **whitelist-filtered** (drops untrusted tags/attrs, kills events, network-img only);
   **Alipay rich-text does NOT accept an HTML string**, only a nodes array.
2. HTML string → mp-html's own parser → mp-html components (more permissive; cross-platform).
3. HTML string → standalone `html-parser`/`htmlparser2` → nodes array → rich-text (required
   on Alipay / uniapp / nvue).
4. Custom renderer emitting node objects directly (skips HTML string) — effectively what
   x-markdown-mini does from marked tokens.

**Consequences baked into adapters:**
- `markdownit-mphtml` (parser-isolation): markdown-it HTML → mp-html with its markdown plugin
  **off**. The `mp-html` adapter feeds raw markdown with the plugin **on**. Both share
  mp-html's identical internal html→nodes→render path, so the **only** difference is the
  parser — isolating parser cost from render-path cost. mp-html's internal html→nodes cost
  appears in both and cancels.
- `native-richtext` diverges by platform (recorded as caveat):
  - WeChat: `markdown → HTML → <rich-text nodes=htmlStr>` (engine parses; whitelist may drop
    nodes → coverage note).
  - Alipay: `markdown → HTML → html-parser → nodes → <rich-text>` (html→nodes step is real
    on-device work, counted in `jsTime`).

The harness records `htmlToNodePath` per pair; the report footnotes it so the "is the win
from the parser or the render path?" question stays answerable.

---

## 6. Streaming protocol

Replays a token stream from `ai-chat-long.md`, pre-tokenized **once** into a committed
fixture `chunks.fixture.json` (cumulative text grows chunk by chunk) so every run/renderer
replays the identical stream.

Two cadences:
- **No-delay** (cost numbers come from here): drive as fast as the renderer accepts —
  measures pure throughput/cost, not `setTimeout` padding.
- **Realistic 30 tok/s** (feel only): used for the OS-level jank/FPS observation.

Per chunk tick, each adapter does its native thing:
- **x-markdown-mini** → `StreamingProcessor`: commit stable blocks, fix up only the tail,
  patch via component-isolated `setData`.
- **towxml / mp-html / wemark / markdown-x-mini / native** → re-parse full cumulative text +
  full `setData` (their only option).

**Per-stream metrics:**

| Metric | Meaning |
|---|---|
| `totalJsTime` | Σ logic-thread busy time across ticks (CPU story) |
| `totalSetDataBytes` | Σ payload bytes across ticks (cross-thread cost — expected far lower for x-markdown-mini, which doesn't re-push committed blocks) |
| `setDataCalls` | number of `setData` invocations |
| `peakSetDataBytes` / `peakRenderTime` | worst single tick (tail-latency / jank proxy) |
| `timeToLastPaint` | first chunk → final render callback |
| `reparsedBytes` | Σ bytes re-fed to transformer (committed-block savings) |

**Headline chart:** cumulative `setDataBytes` vs tick index (one line per renderer) — the
"they re-push everything every tick, you don't" story — plus bars for `totalJsTime` and
`peakRenderTime`.

---

## 7. OS-level CPU/memory ground-truth pass

Manual, scripted, documented step-by-step. Uses the same harness page in **single-renderer
mode** (query param pins one contender) running a **fixed 60s streaming loop** with a 3s idle
marker bracketing the run.

**iOS simulator (Xcode Instruments):**
- Open harness page in WeChat/Alipay simulator build.
- `Time Profiler` (CPU) + `Allocations`/`VM Tracker` (memory), attach to simulator process.
- Record avg CPU% over the 60s window, peak RSS, steady-state RSS after settle. Per renderer.
- **Caveat:** simulator runs on host silicon → treat iOS-sim numbers as **relative ranking**,
  not absolute device perf.

**Android real device (authoritative perf target):**
- `adb shell dumpsys meminfo <host-package>` sampled start/mid/end → TOTAL PSS (memory truth).
- `adb shell top -p <pid>` or `dumpsys cpuinfo` over window → CPU%.
- Optional: Android Studio Profiler allocation timeline.
- `scripts/profile-android.sh` automates the adb sampling loop → `profile-<renderer>.json`.

**Report:** per-renderer peak RSS, steady RSS, avg CPU% — Android-real headline, iOS-sim
corroborating — cross-referenced against in-app `setDataBytes`/`nodeCount` proxies.

Framing: *Android real device = ground truth; iOS simulator = relative; in-app proxies = the
reproducible automatable signal that correlates with both.*

---

## 8. Reporting & reproducible run path

**Artifacts (committed):**
- `benchmark/ondevice/results/<platform>-<device>-<date>.json` — in-app raw per-pair metrics.
- `benchmark/ondevice/results/profile-<platform>-<device>.json` — OS-level pass.
- `benchmark/ondevice/results/report.html` — self-contained report (same spirit as the
  existing `compare-report.html`).

**Report contents:**
1. Environment header — host app + base library versions, device model/OS, pinned renderer
   versions, date.
2. Non-streaming — grouped bars per sample: `setDataBytes`, `renderTime` median+p95,
   `nodeCount`; caveats inline.
3. Streaming — headline line chart (cumulative setData bytes vs tick) + bars (`totalJsTime`,
   `peakRenderTime`, `timeToLastPaint`, `reparsedBytes`).
4. OS-level — peak/steady RSS + avg CPU% (Android-real headline, iOS-sim corroborating).
5. Coverage matrix — which renderer rendered which sample cleanly vs errored.

**Reproducible run path** (`benchmark/ondevice/README.md`):
```
# 1. build + sync core into examples
npm run build

# 2. open examples/wechat in WeChat DevTools  -> navigate to pages/bench
#    open examples/alipay in Alipay DevTools   -> navigate to pages/bench
# 3. tap "Run all" -> harness writes results JSON (FileSystemManager) +
#    optionally POSTs to local collector (npm run bench:collect)
# 4. real device: DevTools -> 真机调试/预览 -> run same page
# 5. OS pass:  scripts/profile-android.sh <pkg>   (Android real device)
#              Xcode Instruments per §7            (iOS simulator)
# 6. generate report:  npm run bench:ondevice:report
```

New npm scripts: `bench:collect` (localhost result collector), `bench:ondevice:report`
(JSON → report.html). Existing `bench:compare` stays as the V8 parse-throughput reference.

---

## 9. Validating the harness itself

A wrong benchmark is worse than none. Guards (in `benchmark/ondevice/__tests__/`, surfaced as
a green/red "harness valid" banner that gates "Run all"):

- **Output-equivalence:** before timing, every adapter renders each sample once; assert a
  non-empty visible tree (text length > 0). Can't win by silently dropping content; genuine
  inability → `coverage: error`, not a zero-cost win.
- **Measurement-boundary unit tests** (vitest, Node side): `jsTime` brackets exactly the
  transform; `setDataBytes === JSON.stringify(payload).length`; `nodeCount` matches a fixture.
- **Determinism:** committed `chunks.fixture.json`; driver asserts reconstructed final string
  == original corpus.
- **Warmup correctness:** discard rep 1; assert rep-1 `jsTime` ≥ median (cold should be
  slower) else warmup is misconfigured.
- **Cross-run stability gate:** run the same renderer twice; median delta >15% flags a noisy
  environment before trusting cross-renderer deltas.
- **Self-comparison sanity:** in-app `jsTime` should track Node-side `bench:compare` within a
  constant factor; wild divergence ⇒ instrumentation bug.

---

## References (research)

- [towxml (GitHub)](https://github.com/sbfkcel/towxml) — markdown/HTML → WXML, one-shot `setData`.
- [wemark (GitHub)](https://github.com/TooBug/wemark) — unmaintained; author recommends native.
- [微信渲染性能优化（官方）](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips/runtime_render.html) — `setData` cross-thread cost, component isolation.
- [微信小程序性能优化方案](https://github.com/dujuncheng/blogs/blob/master/mini_program/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%96%B9%E6%A1%88%E2%80%94%E2%80%94%E8%AE%A9%E4%BD%A0%E7%9A%84%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%A6%82%E6%AD%A4%E4%B8%9D%E6%BB%91.md)
- [rich-text 富文本渲染原理（exparser/LLParser）](https://rileycai.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AF%8C%E6%96%87%E6%9C%AC%E6%B8%B2%E6%9F%93%E9%82%A3%E4%BA%9B%E4%BA%8B/)
- [rich-text-parser / html→nodes（Alipay 需 Array）](https://github.com/jingjingke/richTextParse)
- [markdown-it API（renderer rules）](https://markdown-it.github.io/markdown-it/) · [markdown-it (GitHub)](https://github.com/markdown-it/markdown-it)
