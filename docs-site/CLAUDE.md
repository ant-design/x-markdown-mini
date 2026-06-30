# CLAUDE.md — docs-site

The dumi v2 documentation + marketing site for `x-markdown-mini`. See the repo-root `CLAUDE.md` for the library itself; this file covers the site only.

## Design Context

This site has impeccable design context. Read these before any visual/UX work here:

- **`PRODUCT.md`** — strategic: register, users, purpose, brand personality, anti-references, principles.
- **`DESIGN.md`** — visual: tokens, color, typography, elevation, components (Stitch DESIGN.md format). `.impeccable/design.json` is its machine-readable sidecar.

Quick reference:

- **Register: `brand`.** Design IS the product here. The homepage (`docs/index.md` + `public/site.css`) is the primary surface; the goal is **convince + convert** a developer evaluating the library, then get them to `npm i`.
- **North Star: "The Engineering Whiteboard"** — pure-white canvas, near-black ink, one electric-blue accent (`#2563eb`), masked 56px grid. Vercel/Linear register: precise, fast, credible.
- **Core rules:** One Voice (blue ≤10% of any screen, no second hue) · Whiteboard (bg pure white, never tinted cream/slate) · Single Family (Inter weight contrast carries hierarchy; mono for code only) · Flat-By-Default (no resting shadows; lift on hover) · dark `#0a0a0a` terminals are the only high-contrast "product rendering" moment, motion reserved for streaming/typewriter demos with `prefers-reduced-motion` fallbacks.
- **Anti-references:** not a generic Ant Design clone, not heavy enterprise/corporate SaaS, not toy/playful, not cluttered/over-animated.
- **Accessibility target: WCAG 2.1 AA** — ≥4.5:1 body contrast, visible focus rings, full keyboard nav, reduced-motion fallbacks, correct `lang` per locale.

Iterate with `/impeccable <command>` (e.g. `critique`, `polish`, `audit`).
