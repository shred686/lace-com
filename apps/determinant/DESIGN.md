---
name: Determinant Systems
description: The layer between AI models and your business, made visible — translucent planes over a dark substrate, each service carrying its own light.
colors:
  substrate: "#0a0a0a"
  panel: "rgba(30, 30, 30, 0.65)"
  panel-strong: "rgba(8, 8, 8, 0.86)"
  panel-deep: "rgba(10, 11, 12, 0.72)"
  line: "rgba(255, 255, 255, 0.14)"
  line-soft: "rgba(255, 255, 255, 0.08)"
  bright: "#ffffff"
  muted: "#94a3b8"
  muted-soft: "#555555"
  accent: "#00ffc2"
  accent-soft: "#aaffdc"
  accent-deep: "#00d4a8"
  spark: "#ffd86f"
  spark-hot: "#fff3b8"
  svc-agents: "#5be9ff"
  svc-apps: "#ff9d7a"
  svc-workflows: "#00ffc2"
  svc-rag: "#ffd86f"
  svc-search: "#7aa2ff"
  svc-graphs: "#c58dff"
typography:
  display:
    fontFamily: "Space Grotesk, JetBrains Mono, monospace"
    fontSize: "clamp(2.6rem, 6vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Grotesk, JetBrains Mono, monospace"
    fontSize: "clamp(1.7rem, 3.2vw, 2.7rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk, JetBrains Mono, monospace"
    fontSize: "0.86rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.04em"
  lead:
    fontFamily: "Inter, Red Hat Display, sans-serif"
    fontSize: "clamp(1.02rem, 1.5vw, 1.18rem)"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, Red Hat Display, sans-serif"
    fontSize: "0.96rem"
    fontWeight: 300
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, JetBrains Mono, monospace"
    fontSize: "0.62rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.3em"
  control:
    fontFamily: "Space Grotesk, JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.12em"
rounded:
  square: "0"
  dot: "999px"
spacing:
  section-y: "clamp(5.5rem, 10vw, 10rem)"
  panel: "1.6rem 1.5rem"
  tile: "1.5rem 1.4rem 1.3rem"
  control: "1rem 2rem"
  grid-gap: "1rem"
  split-gap: "clamp(2.5rem, 5vw, 5rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#000000"
    rounded: "{rounded.square}"
    padding: "1rem 2rem"
    typography: "{typography.control}"
  button-primary-hover:
    backgroundColor: "{colors.bright}"
    textColor: "#000000"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.bright}"
    rounded: "{rounded.square}"
    padding: "1rem 2rem"
    typography: "{typography.control}"
  button-ghost-hover:
    textColor: "{colors.accent}"
  glass-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.square}"
    padding: "1.6rem 1.5rem"
  glass-card-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
  service-tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.square}"
    padding: "1.5rem 1.4rem 1.3rem"
  kicker:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
  visual-panel:
    backgroundColor: "{colors.panel-deep}"
    textColor: "{colors.muted}"
    rounded: "{rounded.square}"
    padding: "2rem"
---

# Design System: Determinant Systems

## Overview

**Creative North Star: "The Layer"**

The firm's own sentence is the design brief: *we build the layer between AI models and your business.* This system makes that layer visible. Everything sits on one near-black substrate (`#0a0a0a`), and content arrives as translucent planes laid over it — panels at 65% opacity with `blur(18–20px)` behind them, hairline white borders, and light from below showing through. You can always see that there is something underneath. Nothing is opaque, because an opaque box would be a black box, and a black box is the exact thing this firm sells against.

The register is instrument-grade rather than warm. Every corner is hard 0 — a global `!important` rule enforces it across the whole site — and the type is uppercase Space Grotesk with heavy negative tracking, set against Inter at weight 300 for reading. The result reads as equipment, not as a brochure: matte, square, precisely lit. Trust here comes from precision, not friendliness.

The one place the system allows itself real colour is the service layer. Each of the six capabilities owns a hue, carried through its tile border, glow, icon, and its section's `--svc` custom property — cyan for agents, coral for the app factory, mint for workflows, amber for RAG, periwinkle for search, violet for knowledge graphs. Everything else is monochrome. The palette says *the firm is one substrate; the services are six different lights passing through it.*

LACE's mint sits in the same hue family as this system's accent (`#00a882` there, `#00ffc2` here), and that resemblance is deliberate: LACE is a Determinant product. The two are separated by register, not by hue — LACE is muted green on white paper, Determinant is luminous mint on black glass.

**Key Characteristics:**
- Hard 0-radius everywhere, enforced globally; only status dots are round.
- Translucent panels with real backdrop blur over a single dark substrate — never opaque cards.
- Uppercase Space Grotesk for every heading and control; Inter 300 for all reading.
- Monochrome by default, with one owned accent hue per service capability.
- Light comes from behind and below the interface, never from a decorative glow on top of it.

## Colors

A single near-black substrate, two steps of translucent plane, cool grey type, and one electric mint — plus a six-hue service spectrum that is the only chromatic freedom in the system.

### Primary
- **Signal Mint** (`#00ffc2`): the firm's accent. Kickers, the primary button gradient, hover borders, the `.lace-accent-word` gradient (`#00ffc2 → #00d4a8`), and the workflows service. Luminous rather than saturated — it reads as emitted light on the black substrate.
- **Mint Soft** (`#aaffdc`): the light end of the primary button gradient (`135deg, #aaffdc → #00fdc1`) and hover states.
- **Mint Deep** (`#00d4a8`): the closing stop of the accent-word gradient. Never used alone.

### Secondary — the service spectrum
Six hues, one per capability, applied through `--tile-accent` on the tile and `--svc` on the matching section. A service's hue governs its tile border (30% mix), its ambient glow (`0 0 22px -14px`), its icon, and its "more" link (80% mixed toward white).
- **Agent Cyan** (`#5be9ff`) — AI Agents
- **Factory Coral** (`#ff9d7a`) — App Factory
- **Workflow Mint** (`#00ffc2`) — LLM-Powered Workflows (shares the firm accent)
- **Retrieval Amber** (`#ffd86f`) — Retrieval-Augmented Generation; also the hero spark colour
- **Search Periwinkle** (`#7aa2ff`) — Enterprise Search
- **Graph Violet** (`#c58dff`) — Knowledge Graphs

### Tertiary
- **Spark Amber** (`#ffd86f`) and **Spark Hot** (`#fff3b8`): the drifting particles in the hero canvas. Warm points against the cool field — the only warmth in the system, and it is atmospheric rather than semantic.

### Neutral
- **Substrate** (`#0a0a0a`): the ground under everything. Not pure black; there is a hair of light in it.
- **Panel** (`rgba(30,30,30,0.65)`): the standard translucent plane. Always paired with `backdrop-filter: blur(18–20px)`.
- **Panel Strong** (`rgba(8,8,8,0.86)`) and **Panel Deep** (`rgba(10,11,12,0.72)`): denser planes for nav chrome and visual panels where content behind must recede.
- **Bright** (`#ffffff`): headings and emphatic values only.
- **Muted** (`#94a3b8`): all body copy. A cool blue-grey, chosen to sit with the accent rather than a neutral grey.
- **Muted Soft** (`#555555`): de-emphasised meta and disabled states.
- **Line** (`rgba(255,255,255,0.14)`) and **Line Soft** (`rgba(255,255,255,0.08)`): panel edges. The border is what makes a plane read as a plane.

### Named Rules

**The One-Light Rule.** A surface takes the firm accent *or* a service hue, never both. If a section carries `--svc`, its kickers, borders, and links all take that hue; the mint stands down.

**The Translucent-Plane Rule.** Every content panel is translucent with a real backdrop blur and a hairline border. An opaque panel breaks the metaphor — the layer has to show what is underneath it.

**The Cool-Grey Rule.** Body copy is `#94a3b8`, never a neutral grey. On a black substrate a true grey reads as dead; the blue bias keeps it alive next to the accent.

## Typography

**Display Font:** Space Grotesk (with JetBrains Mono, then monospace)
**Body Font:** Inter (with Red Hat Display, Avenir Next, Segoe UI)
**Label Font:** Space Grotesk at wide tracking — there is no separate mono face in this system.

**Character:** A hard, geometric grotesk set uppercase with aggressive negative tracking does all the structural work; a neutral, low-contrast humanist sans at weight 300 does all the reading. The gap between them is deliberate and wide — headings are equipment labelling, body copy is documentation. Nothing in between competes.

### Hierarchy
- **Display** (400, `clamp(2.6rem, 6vw, 5rem)`, line-height 0.92, tracking -0.04em, uppercase): the hero headline, set as individual `.hero-title-line` elements so lines can be staged and accented independently. At 1440px this renders around 80px with -3.2px tracking — the tightest setting in either site.
- **Headline** (400, `clamp(1.7rem, 3.2vw, 2.7rem)`, line-height 1.02, tracking -0.02em, uppercase, `#ffffff`): section H2s.
- **Title** (700, 0.86rem, tracking 0.04em, uppercase, `#ffffff`): tile and card headings. Note the weight jump — at this size the grotesk needs 700 to hold against the panel.
- **Lead** (400, `clamp(1.02rem, 1.5vw, 1.18rem)`, line-height 1.7, Inter, Muted): the paragraph directly under a heading.
- **Body** (300, 0.96rem, line-height 1.75, Inter, Muted): all running copy. The 1.75 line-height is doing real work on a dark ground, where tight leading closes up.
- **Label / Kicker** (700, 0.62rem, tracking 0.3em, uppercase, Space Grotesk, accent or `--svc`): one per section, above the H2.
- **Control** (400, 0.75rem, tracking 0.12em, uppercase, Space Grotesk): every button and nav CTA.

### Named Rules

**The Two-Face Rule.** Space Grotesk is structure — headings, labels, controls, anything uppercase. Inter is prose. A sentence never appears in Space Grotesk and a heading never appears in Inter.

**The Uppercase-Structure Rule.** Every heading, kicker, tile title, and control is uppercase. The sentence-case Red Hat Display headings on the interior pages belong to the retired system (see Components).

**The Tracking-Inverts Rule.** Big type tracks tight and negative (-0.02em to -0.04em); small type tracks wide and positive (0.12em to 0.3em). There is no heading at default tracking anywhere in the system.

## Layout

The page is one continuous dark field; sections do not have their own backgrounds. Rhythm comes entirely from `clamp(5.5rem, 10vw, 10rem)` of vertical section padding — generous, and the primary reason the site reads as unhurried rather than as a sales funnel. Content sits inside a `min(1440px, calc(100% - 4rem))` shell.

The recurring composition is an asymmetric split: `minmax(0, 5fr) minmax(0, 6fr)` with `clamp(2.5rem, 5vw, 5rem)` between columns, copy on the narrow side and the visual on the wide one. The tile grid runs two columns at `1rem` gaps. A 12-column `lace-grid` exists for the platform section, where the feature card spans 8.

The hero is full-viewport with a fixed `<canvas>` neural field behind everything at `z-index: 0`, so the particle field persists behind the first sections as they scroll over it. That fixed canvas is the substrate made literal — the layers move, the field does not.

Interior pages inherit the same shell and section rhythm through `.ds-site` and `.ds-interior`, and are the surfaces most in need of migration to this system.

## Elevation & Depth

**This system builds depth with translucency, not shadow.** A panel reads as raised because you can see the substrate blurred through it and a hairline catches light at its edge — the same way a pane of glass reads over a lit surface. Standard panels carry no `box-shadow` at all.

The exception is the service tile, which uses colour as light: a soft outer bloom and an inner rim glow in its own service hue, both at heavy negative spread so they read as the tile being *lit from within* rather than as a halo pasted behind it. On hover the bloom tightens, the border strengthens from 30% to 55% mix, and a genuine neutral drop shadow appears underneath — the tile lifts 3px and only then casts.

### Shadow Vocabulary
- **Tile bloom** (`0 0 22px -14px var(--tile-accent), inset 0 0 26px -20px var(--tile-accent)`): service tiles at rest. Paired always with a matching border; never used alone.
- **Tile lift** (`0 0 28px -10px var(--tile-accent), inset 0 0 26px -18px var(--tile-accent), 0 18px 44px rgba(0,0,0,0.45)`): service tile hover. The neutral third layer is what makes the lift read as physical.
- **Nav settle** (`0 18px 40px rgba(0,0,0,0.46)`, interpolated by `--nav-solid`): the sticky nav's shadow fades in with its background as the page scrolls.

### Named Rules

**The Glass-Not-Shadow Rule.** Depth comes from `backdrop-filter` and a hairline border. If a panel needs a shadow to separate from the ground, the blur or the border is wrong.

**The Glow-Is-Lit-From-Within Rule.** A coloured glow is only permitted when the element also carries that colour as its border and its content — the tile is *made of* that light. A coloured shadow under an element that is otherwise monochrome is decoration and does not belong here.

## Shapes

**Everything is square.** A global `:is(...) { border-radius: 0 !important; }` rule at `global.css:1342` enforces 0 radius across the nav, hero, all cards and tiles, buttons, images, and marquees. This is the system's single most defining formal decision, and it is intentionally absolute.

Two exceptions exist and both are semantic:
- **Status dots** are `999px` — the brand dot in the wordmark (a `130deg` white → `#63b9ff` → `#4ee6c7` gradient with an 18px cyan bloom), agent-step pins, and connector dots. Round means *state*.
- **Connector tiles** in the integrations strip retain a small `9.6px` radius, because they hold third-party product logos that carry their own rounded shapes.

Note that `global.css` still contains per-component radius declarations from `0.52rem` to `1.25rem`, and a `--radius-square-lg: 0.12rem` token. All of these are dead — the `!important` override wins. Do not treat them as the system, and do not reinstate them.

Borders are always 1px. Emphasis on a panel comes from raising its border's opacity or mixing in a service hue, never from thickening it.

## Components

### Glass Card
The default container.
- **Shape:** 0 radius, 1px `rgba(255,255,255,0.14)` border.
- **Background:** `rgba(30,30,30,0.65)` with `backdrop-filter: blur(20px)`.
- **Padding:** `1.6rem 1.5rem`.
- **Hover:** border shifts to `rgba(0,255,194,0.35)` over 300ms. No transform, no shadow — the plane brightens, it does not move.

### Service Tile
The system's signature component: six of them, each carrying its own light.
- **Shape:** 0 radius; border `color-mix(in srgb, var(--tile-accent) 30%, transparent)`.
- **Background:** `linear-gradient(155deg, color-mix(in srgb, var(--tile-accent) 6%, transparent), transparent 60%)` over the standard panel, with `blur(18px)`.
- **Structure:** flex column, `0.55rem` gap — a 1.6rem accent-coloured icon, a 700-weight uppercase title, a 0.82rem blurb, then a "more" link pushed to the bottom with `margin-top: auto`.
- **Hover:** lifts 3px, border to 55% mix, bloom tightens, neutral drop shadow appears. 260ms ease.
- **Rule:** the accent is set inline per tile via `--tile-accent`, and the matching deep-dive section sets the same value as `--svc`. The hue must match across both or the association breaks.

### Buttons
- **Shape:** 0 radius, `1rem 2rem` padding, uppercase Space Grotesk at 0.75rem / 0.12em.
- **Primary:** `linear-gradient(135deg, #aaffdc, #00fdc1)` with pure black text. On hover the gradient flattens to solid `#fff` — the light goes neutral rather than intensifying.
- **Ghost:** `rgba(255,255,255,0.04)` with a `rgba(255,255,255,0.15)` border and `blur(8px)`. On hover the border takes `rgba(0,255,194,0.4)` and the label takes the accent.
- **Nav CTA:** the same control type at 0.84rem in the sticky bar; the only button that ever appears in the nav.

### Navigation
- **Style:** sticky at `top: 0.9rem`, fully transparent at rest. Border, background (`rgba(7,9,11,0.82)`), `blur(2px → 14px)`, and shadow all interpolate from a `--nav-solid` scroll property, so the bar condenses out of the page rather than appearing.
- **Brand:** wordmark at weight 300, `0.02em` tracking, preceded by the gradient brand dot.
- **Links:** 0.9rem Muted, to Bright on hover.
- **Mobile:** a 2.2rem square toggle whose two lines rotate into an X at 180ms.
- **Language toggle:** `/es/` switch, styled as a bordered ghost control. It is a first-class nav element, not an afterthought — Spanish is a confirmed audience.

### Visual Panel
The frame for product diagrams and animated scenes inside a service section.
- **Shape:** 0 radius, 1px `rgba(91,233,255,0.22)`-style border tinted by the section's `--svc`.
- **Background:** `rgba(10,11,12,0.72)` with `blur(16px)`; `2rem` padding.
- **Caption:** a small uppercase label beneath, in the section's service hue.

### Hero Canvas
A fixed full-viewport `<canvas>` neural field at `z-index: 0` with drifting amber sparks (`#ffd86f`, hot points `#fff3b8`). It sits behind every section, not just the hero, which is what makes the substrate feel continuous. It must remain non-interactive (`pointer-events: none`) and must be suppressed under `prefers-reduced-motion`.

### Retired: the interior system (`global.css` base + `.ds-*`)
The service pages, about, contact, and 404 run the previous generation: Red Hat Display at weight 300, **sentence-case** headings, `.surface-card` slabs on a linear-gradient background with `0 18px 40px rgba(0,0,0,0.46)` shadows, blue/teal ambient glows (`rgba(70,118,255,0.32)`, `rgba(56,208,180,0.22)`), and mint `#62e6c6` mono eyebrows.

**It is not the system.** Treat it as an incumbent being retired. Do not extend it and do not add new `.surface-card` or `.pillar-card` instances. Note the priority carefully: per PRODUCT.md the six service pages are the firm's primary search entry point, so they carry the most commercial weight *and* the oldest look. They are the highest-value migration targets, not the lowest. The shared nav, footer, and `.ds-site` shell stay in service through the transition.

Also retired: the exploratory theme routes under `src/pages/themes/` (blueprint, midnight, forge, circuit, review) and the `--radius-square-lg` token. These are exploration, not identity.

## Do's and Don'ts

### Do:
- **Do** keep every corner at 0. The global `!important` rule is the system, not a bug to work around.
- **Do** build containers as translucent planes: `rgba(30,30,30,0.65)`, `blur(18–20px)`, 1px hairline border.
- **Do** set headings, kickers, tile titles, and controls in uppercase Space Grotesk with negative tracking on the large sizes and wide tracking on the small ones.
- **Do** set all reading copy in Inter at weight 300 with 1.7–1.75 line-height and `#94a3b8`.
- **Do** give each service its own hue and carry it consistently across tile border, glow, icon, link, and the matching section's `--svc`.
- **Do** let a coloured glow appear only on an element that is itself made of that colour.
- **Do** keep `clamp(5.5rem, 10vw, 10rem)` of section padding; the air is what separates this from a sales page.
- **Do** treat the Spanish `/es/` surface and the language toggle as first-class.
- **Do** suppress the hero canvas and all ambient motion under `prefers-reduced-motion`.

### Don't:
- **Don't** add a border radius to anything. Round is reserved for status dots and third-party logo tiles.
- **Don't** use an opaque panel. If you cannot see the substrate through it, it is not a layer.
- **Don't** put a coloured glow on a monochrome element — that is the decorative-halo pattern this system explicitly avoids.
- **Don't** set a heading in sentence case or in Red Hat Display; that is the retired interior system.
- **Don't** introduce a seventh service hue, or reuse an existing one for a new capability. The spectrum is a fixed set of six.
- **Don't** let the firm accent and a service hue appear as peers on the same surface.
- **Don't** reinstate the `0.52–1.25rem` radii or the `--radius-square-lg` token still present in `global.css`; they are dead code.
- **Don't** move Determinant's accent off the mint family — the resemblance to LACE's green is deliberate. The two brands separate by register (luminous on black vs. muted on white), not by hue.
- **Don't** invent client names, logos, project counts, or outcome metrics to fill a panel — none exist (see PRODUCT.md).
