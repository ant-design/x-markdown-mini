---
name: x-markdown-mini
description: Multi-platform, streaming-friendly, high-performance Markdown renderer for mini-programs
colors:
  ink: "#171717"
  ink-secondary: "#525252"
  ink-tertiary: "#737373"
  ink-quaternary: "#a3a3a3"
  bg: "#ffffff"
  bg-subtle: "#fafafa"
  bg-muted: "#f5f5f5"
  border: "#e5e5e5"
  border-subtle: "#f0f0f0"
  border-strong: "#d4d4d4"
  accent: "#2563eb"
  accent-subtle: "#2563eb14"
  accent-focus: "#2563eb3d"
  code-surface: "#0a0a0a"
typography:
  display:
    fontFamily: "Inter, SF Pro Display, PingFang SC, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, SF Pro Display, PingFang SC, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.23
    letterSpacing: "0"
  title:
    fontFamily: "Inter, SF Pro Text, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.35
  body:
    fontFamily: "Inter, SF Pro Text, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0 17px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "#262626"
    textColor: "{colors.bg}"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 17px"
    height: "42px"
  button-secondary-hover:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.ink}"
  install-command:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px 0 15px"
    height: "42px"
  card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "22px"
  card-hover:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
  badge:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  code-block:
    backgroundColor: "{colors.code-surface}"
    textColor: "#e5e7eb"
    rounded: "{rounded.md}"
    padding: "18px"
---

# Design System: x-markdown-mini

## 1. Overview

**Creative North Star: "The Engineering Whiteboard"**

A white surface, near-black ink, and a single electric-blue marker. The site behaves like a senior engineer at a whiteboard explaining a sharp design decision: the architecture pipeline gets drawn cleanly, the numbers get written down, and nothing decorative competes for attention. The page is a quiet frame; the only places that go loud are the dark code terminals where the library actually performs. A faint 56px grid, radially masked behind the whole page, is the whiteboard's own ruling: present, never insistent.

This is a **brand** surface in the Vercel/Linear register: confident and exact, clean enough to read like good developer documentation. Restraint here reads as confidence, not caution. The engineering speaks for itself, so the chrome stays out of the way. It commits hard to one accent (`#2563eb`) and one near-black ink against pure white, and refuses to hedge that monochrome with a second decorative hue.

The system explicitly rejects what PRODUCT.md names as anti-references: it must not read as a **generic Ant Design clone** or a default component-library docs theme; it avoids **heavy enterprise / corporate SaaS** density, gradient-soup heroes, and badge clutter; it is never **toy, playful, or cartoonish**; and it stays free of **clutter and over-animation**, reserving motion strictly for where it demonstrates the product.

**Key Characteristics:**
- Pure-white canvas, near-black ink, one electric-blue accent. No second hue.
- Flat at rest; surfaces lift only in response to hover.
- Dark `#0a0a0a` terminals are the single high-contrast moment: where the product renders.
- Inter at large weight-and-size contrast carries the entire type voice.
- Motion only where it shows streaming, tail-fixup, or typewriter behavior.

## 2. Colors

A monochrome zinc ramp on pure white, lit by exactly one electric blue. The palette is the discipline: the rarity of the blue is what makes it read as a deliberate signal, not decoration.

### Primary
- **Electric Blue** (`#2563eb`): The one voice. Used for links, active nav/TOC states, the eyebrow/kicker labels, capability-card numerals, and focus rings. It appears on a small fraction of any screen and never fills a large surface. `#2563eb14` (8% alpha) tints the active sidebar item; `#2563eb3d` (24% alpha) is the hover-border and focus glow.

### Neutral
- **Ink** (`#171717`): Primary text, headings, the primary button fill. The near-black that anchors the whole page.
- **Ink Secondary** (`#525252`): Body copy in prose, supporting paragraphs, secondary labels. Sits at ≥4.5:1 on white.
- **Ink Tertiary** (`#737373`): Captions, card descriptions, metadata. Reserve for large or non-essential text.
- **Ink Quaternary** (`#a3a3a3`): Disabled and faint hints only. Never body copy.
- **Background** (`#ffffff`): The canvas. The whole page paints on white via a fixed pseudo-element gradient (`#ffffff → #fafafa`) plus the masked grid.
- **Background Subtle** (`#fafafa`): Prose `<pre>` blocks, table headers, badges, doc-list cards, the flow panel.
- **Background Muted** (`#f5f5f5`): Hover state on subtle surfaces.
- **Border** (`#e5e5e5`): Default 1px card and divider stroke.
- **Border Subtle** (`#f0f0f0`): Hairline rules under h2, between sidebar groups, inside prose code.
- **Border Strong** (`#d4d4d4`): Secondary-button stroke, dark-terminal frame.

### Tertiary
- **Code Surface** (`#0a0a0a`): The near-pure-black of demo terminals and code-block heroes, carrying `#e5e7eb` text. Used only for the "the product is performing" moments; the traffic-light dots (`#f87171` / `#fbbf24` / `#34d399`) live only here.

### Named Rules
**The One Voice Rule.** Electric Blue (`#2563eb`) is the only chromatic color on the page and appears on ≤10% of any screen. Its rarity is the signal. Never introduce a second accent hue, and never use blue as a large fill.

**The Whiteboard Rule.** The base is pure white with a near-black ink ramp. Tint neutrals only toward black, never toward warm cream or cool slate. The body background is `#ffffff`, never a tinted near-white.

## 3. Typography

**Display Font:** Inter (with SF Pro Display, PingFang SC, system-ui fallback)
**Body Font:** Inter (with SF Pro Text, -apple-system, PingFang SC fallback)
**Label/Mono Font:** ui-monospace / SFMono-Regular / Menlo (for install commands, code, demo source)

**Character:** One family, Inter, doing all the work through committed weight-and-size contrast rather than a competing display face. Inter's neutral, screen-native geometry reads as engineering-precise; the personality comes from the jump between a 750-weight hero and a 400-weight body, not from a second typeface. Mono appears only where the content is literally code or a shell command.

### Hierarchy
- **Display** (750, `clamp(2.5rem, 6vw, 4.5rem)`→ ~52–72px on the home hero, line-height 1, `-0.01em`): The home title only. `text-wrap: balance` keeps it even.
- **Headline** (700, 28–30px, line-height ~1.2): Landing section `<h2>`s and prose page titles. The primary scanning anchor.
- **Title** (650, 20px, line-height 1.35): Prose `<h2>`, underlined with a `#f0f0f0` hairline. Card and demo-phone titles (16–17px) sit just below.
- **Body** (400, 15px, line-height 1.75): Prose paragraphs and list items in Ink Secondary. Cap measure at ~65–75ch; the content column already enforces this.
- **Label** (700, 12px, `0.08em`, uppercase): The eyebrow/kicker and search-group headers. Reserved for ≤4-word labels, never sentences.

### Named Rules
**The Single Family Rule.** Inter carries every non-code surface. Hierarchy is built from weight (400 / 650 / 700 / 750) and size, never from adding a second display or serif face. Mono is for code and commands only.

**The Quiet Caps Rule.** Uppercase is permitted only on the eyebrow label and short group headers (≤4 words). Body copy is never set in all caps.

## 4. Elevation

Flat by default. The system conveys structure through 1px borders and the zinc ramp, not through resting shadows. Depth is a **response to state**: a card is a flat bordered rectangle until hover, when it lifts 1px (`translateY(-1px)`), shifts its border toward `#2563eb3d`, and casts a soft diffuse shadow. The one standing exception is the dark demo terminal, which carries a deep ambient shadow at rest because it represents a lifted device "performing" above the page.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 16px 40px #e5e5e5`): Cards and capability tiles on hover, paired with `translateY(-1px)`. A near-neutral diffuse glow, never a dark drop shadow.
- **Demo stage** (`box-shadow: 0 22px 70px #d4d4d4`): The dark terminal at rest; reads as a device floating above the whiteboard.
- **Overlay** (`box-shadow: 0 24px 80px rgba(0,0,0,0.15)`): The search modal and floating panels only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest with a 1px border. Shadows appear only as a response to hover/focus, or to lift the one dark "performing" terminal. If a card has a resting drop shadow, it's wrong.

**The Neutral-Shadow Rule.** Hover shadows are tinted from the zinc ramp (`#e5e5e5` / `#d4d4d4`), not black with opacity. The page never looks like a 2014 Material card.

## 5. Components

### Buttons
- **Shape:** Gently squared (8px radius, `rounded.md`); the install command uses a tighter 6px.
- **Primary:** Ink fill (`#171717`) with white text, 42px tall, `0 17px` padding, 650 weight. Hover darkens to `#262626`.
- **Secondary:** Transparent fill, Ink text, 1px `border-strong` (`#d4d4d4`) stroke. Hover fills `bg-subtle` and darkens the border to `#a3a3a3`.
- **Install command:** A monospace pill-button (`npm i …`) with a copy icon that swaps to a check and turns Electric Blue on copy (`data-copied`). The signature hero affordance.
- **Hover / Focus:** 0.15s color/border transitions. Focus must be a visible Electric-Blue ring (`#2563eb3d`) for AA keyboard use.

### Cards / Containers
- **Corner Style:** 8px radius (`rounded.md`).
- **Background:** White (`#ffffff`), or `bg-subtle` (`#fafafa`) for quieter doc-list and flow cards.
- **Border:** 1px `#e5e5e5` at rest.
- **Shadow Strategy:** None at rest. On hover: border → `#2563eb3d`, `translateY(-1px)`, `0 16px 40px #e5e5e5` (see Elevation).
- **Internal Padding:** 18–22px.
- **Anti-pattern:** Never an identical icon+heading+text grid repeated endlessly, and never a colored left-border stripe.

### Navigation
- **Header:** 80px tall, transparent (sits on the page's own grid background), no border or shadow. Logo in Inter 700 at 15px. Dumi defaults are stripped; nav and search are rebuilt as quiet 36px icon buttons that fill `#f4f4f5` on hover.
- **Sidebar:** 228px. Group titles in soft gray (`#9a9a9a`, 22px). Items at 18px; active item is Electric Blue on an 8% blue tint (`#2563eb14`), 600 weight.
- **TOC:** Right rail, 13px, `#737373`. Active item is Electric Blue with a blue left rule (the only place a left-border accent is permitted, at 1px).

### Code / Demo Terminal (signature component)
- **Surface:** `#0a0a0a` with `#e5e7eb` text, 1px `#d4d4d4` frame, 8px radius, deep ambient shadow.
- **Toolbar:** 38px bar with three traffic-light dots (`#f87171` / `#fbbf24` / `#34d399`) and a dim title.
- **Behavior:** Hosts the streaming/typewriter demo. Lines reveal with a caret animation (`xmd-stream-caret`) and a progress bar; this is the one place motion is the point. Must honor `prefers-reduced-motion` with a static fully-rendered state.

## 6. Do's and Don'ts

### Do:
- **Do** keep the body background pure white (`#ffffff`); carry depth with the masked 56px grid and the zinc ramp.
- **Do** use Electric Blue (`#2563eb`) sparingly, on ≤10% of any screen, as the single accent.
- **Do** build hierarchy from Inter weight contrast (400 → 650 → 700 → 750), not from a second typeface.
- **Do** keep surfaces flat at rest; let shadow and lift appear only on hover/focus.
- **Do** reserve the dark `#0a0a0a` terminal for moments where the product is rendering, and give every demo a `prefers-reduced-motion` static fallback.
- **Do** keep body copy on the ink end of the ramp (`#525252` or darker) to hold ≥4.5:1; reserve `#737373`/`#a3a3a3` for large or non-essential text.
- **Do** give every interactive element a visible Electric-Blue focus ring for AA keyboard navigation.

### Don't:
- **Don't** make it look like a generic Ant Design clone or a default component-library docs theme.
- **Don't** drift into heavy enterprise/corporate SaaS: no gradient-heavy hero, no badge clutter, no "enterprise-grade / next-generation" scaffolding.
- **Don't** introduce toy, playful, or cartoonish elements: no mascots, bright illustration, or playful gradients.
- **Don't** clutter or over-animate: no scroll-jacking, no fade-on-scroll on every section, no decoration competing with content. Motion is for demonstrating the product only.
- **Don't** add a second accent hue, or use blue as a large fill (violates The One Voice Rule).
- **Don't** tint the background toward warm cream or cool slate; the canvas is pure white (The Whiteboard Rule).
- **Don't** use a colored left-border stripe wider than the 1px TOC rule, and never put a resting drop shadow on a card.
- **Don't** set body copy in all caps; uppercase is for ≤4-word labels only.
