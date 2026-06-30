# Product

## Register

brand

## Users

Front-end and full-stack developers building WeChat and Alipay mini-programs, with a strong lean toward AI-product teams: people wiring an LLM chat or content stream into a mini-program and needing Markdown to render natively, token-by-token, without a `rich-text` whitelist fighting them.

Their context when they land here: evaluating. They've hit the wall that mini-programs have no good Markdown story (no DOM, `rich-text` strips events and blocks per-node animation), they're comparing options, and they want to know in under a minute whether this library is fast, multi-platform, and streaming-safe before they commit an `npm i`. They read code more fluently than prose and trust a benchmark number over an adjective.

The job to be done: decide "yes, this solves my streaming-Markdown-in-a-mini-program problem" and copy the install command.

## Product Purpose

`x-markdown-mini` is a direct-to-platform Markdown renderer for WeChat and Alipay mini-programs: a Markdown string enters the parse chain and exits as platform-specific `MiniNode[]` ready to render, with first-class streaming (stable-block caching, tail auto-completion) and per-node animation.

This site exists to **convince and convert**. The primary surface is the marketing homepage; the docs are the supporting payoff once a visitor is sold. Success is a developer arriving skeptical, leaving convinced the library is multi-platform, streaming-friendly, and genuinely fast, and running the install command. The proof points that carry that case: the short architecture pipeline (`Markdown → lexer → Token[] → tokensToWechat/Alipay → MiniNode[]`), the streaming/typewriter live demo, the platform-divergence handling, and concrete performance/bundle numbers.

## Brand Personality

**Precise, fast, credible.** Engineering-first voice: it earns trust by showing the architecture and the numbers, not by adjectives. Confident and exact in the register of Vercel and Linear, clean enough to read like good developer documentation. The tone is a senior engineer explaining a sharp design decision, not a marketer selling a platform.

Emotional goal: a visitor should feel *this was built by people who understand the constraint deeply* and *I can trust this in production*. Calm authority over hype.

## Anti-references

- **Generic Ant Design clone.** Must not read as a stock antd admin theme or a default component-library docs site. It belongs to the x-family but has its own voice.
- **Heavy enterprise / corporate SaaS.** No dense gradient-heavy hero, no badge clutter, no "enterprise-grade / next-generation" marketing scaffolding.
- **Toy / playful / cartoonish.** No mascots, bright illustration, or playful gradients. Engineering credibility is the currency.
- **Cluttered / over-animated.** No scroll-jacking, no fade-on-scroll for every section, no decoration competing with the content. Motion is reserved for where it demonstrates the product (streaming, typewriter).

## Design Principles

1. **Show the mechanism, don't claim it.** The architecture pipeline, the actual `MiniNode[]` output, and a live streaming render do the persuading. Diagrams and demos over adjectives.
2. **Proof in numbers.** Performance and bundle figures are the argument. Every performance claim is a concrete, verifiable number, not "blazing fast."
3. **Practice what you preach.** A site for a Markdown renderer must itself render Markdown beautifully and feel fast. The demo *is* the product running.
4. **Restraint that reads as confidence, not caution.** Clean and minimal because the engineering speaks for itself, not because it's playing safe. Commit to the one brand accent and the monochrome base; don't hedge.
5. **Motion only where it demonstrates.** Animation earns its place when it shows streaming, tail-fixup, or typewriter behavior. Everywhere else, the page is still.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**:

- Body text ≥4.5:1 contrast against its background; large text ≥3:1. Watch the muted-gray-on-near-white tertiary text already in use (`#737373`/`#a3a3a3` on white) and keep body copy on the ink end of the ramp.
- Visible keyboard focus states on all interactive elements (nav, copy-command button, cards, playground controls).
- Full keyboard navigation, including the search modal and platform/code switchers.
- `prefers-reduced-motion` honored on the streaming, typewriter, and animation demos: provide a static rendered fallback rather than a blank or perpetually-animating state.
- The site ships zh-CN and en-US; keep `lang` correct per locale and don't bake meaning into color alone.
