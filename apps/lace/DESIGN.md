---
name: LACE Platform
description: An engineering drawing of a governed system — ruled cells, one earned green, and product fragments that show the receipts.
colors:
  bg: "#f6f7f9"
  surface: "#ffffff"
  ink: "#0e1210"
  ink-soft: "#2d3748"
  muted: "#4a5568"
  faint: "#656f7c"
  hair: "rgba(13, 27, 22, 0.09)"
  hair-soft: "rgba(13, 27, 22, 0.055)"
  line: "rgba(13, 27, 22, 0.1)"
  line-soft: "rgba(13, 27, 22, 0.06)"
  verified-green: "#00a882"
  verified-green-deep: "#00745c"
  verified-green-bright: "#00c9a0"
  verified-green-ink: "#03271e"
  sheen-mint: "#7dffdb"
  flag-amber: "#d99a06"
  flag-amber-ink: "#7a5200"
  flag-denied: "#c2544a"
  window-ink: "#0c1412"
typography:
  display:
    fontFamily: "Space Grotesk, JetBrains Mono, monospace"
    fontSize: "clamp(2.6rem, 7.4vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 0.97
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, Red Hat Display, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.2rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Space Grotesk, Red Hat Display, sans-serif"
    fontSize: "clamp(1.35rem, 2.3vw, 1.8rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  editorial:
    fontFamily: "Space Grotesk, Red Hat Display, sans-serif"
    fontSize: "clamp(1.7rem, 3.4vw, 2.65rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Space Grotesk, Red Hat Display, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  lead:
    fontFamily: "Space Grotesk, Red Hat Display, sans-serif"
    fontSize: "clamp(1rem, 1.5vw, 1.22rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.6rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.2em"
  eyebrow:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.62rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.28em"
  readout:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.58rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  hairline: "0"
  sm: "3px"
  md: "6px"
  window: "10px"
spacing:
  cell-y: "clamp(2.2rem, 4.5vw, 3.6rem)"
  cell-x: "clamp(1.2rem, 3.5vw, 3.2rem)"
  editorial-y: "clamp(4rem, 8vw, 6.5rem)"
  stack: "1.8rem"
  gutter: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.verified-green}"
    textColor: "{colors.verified-green-ink}"
    rounded: "{rounded.sm}"
    padding: "1rem 2rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "1rem 2rem"
    typography: "{typography.label}"
  button-ghost-hover:
    textColor: "{colors.verified-green-deep}"
  cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "clamp(2.2rem, 4.5vw, 3.6rem) clamp(1.2rem, 3.5vw, 3.2rem)"
  cell-link:
    backgroundColor: "transparent"
    textColor: "{colors.verified-green-deep}"
    typography: "{typography.label}"
  kicker-index:
    backgroundColor: "transparent"
    textColor: "{colors.verified-green-deep}"
    typography: "{typography.label}"
  fragment-window:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.window}"
    width: "min(460px, 100%)"
  flag-warning:
    backgroundColor: "{colors.flag-amber}"
    textColor: "{colors.flag-amber-ink}"
    rounded: "{rounded.md}"
    padding: "0.55rem 0.8rem"
---

# Design System: LACE Platform

## Overview

**Creative North Star: "The Governed Line"**

LACE's own business plan describes the product as a manufacturing line: raw material in one end, inspectable stations along the way, a finished artifact out the other — and you can walk up to any station and see what it did. This system draws that line literally. The page is built on hairline rules. Content sits in surveyed cells divided by those rules. Where rules meet, a small green `+` crosshair marks the junction, the way a drawing marks a surveyed point. Nothing floats above the page; nothing casts a decorative shadow. The line is the structure, and the structure is the argument.

This is an engineering drawing, not a brochure. That choice is doing commercial work: the buyer is a technical champion who will forward these pages to a security reviewer, and the reviewer's instinct is to distrust polish. A ruled sheet with labeled cells and a monospaced index reads as a specification. The moments of warmth are rationed and specific — one mint sheen across the word LACE on first paint, a green highlight on a matched citation — and they land harder for being rare.

The system runs on a near-white ground (`#f6f7f9`) under a faint 48px blueprint grid and soft green radial light. Type is Space Grotesk set in uppercase for every heading level, which keeps headings reading as *labels on a drawing* rather than as magazine display. The single accent green is never decorative: it marks things the system verified. Depth appears in exactly one place — the product fragment windows, which lift off the sheet because they are the only real evidence on the page.

**Key Characteristics:**
- Hairline rules and `+` crosshairs are the page structure; there are no cards.
- Flat by default — the fragment window is the one thing allowed to lift.
- Uppercase Space Grotesk headings; JetBrains Mono for every label, index, and readout.
- One accent green, rationed and earned; a separate amber reserved for flagged conflicts.
- Every claim on the page is accompanied by the product surface that proves it.

## Colors

A near-white engineering sheet, greyed ink at four steps, and one green that is spent only where the system has verified something.

### Primary
- **Verified Green** (`#00a882`): the anchor accent. Crosshairs, index numbers, evidence highlights, the knob on a bitemporal scrubber, the dot on a status chip. It appears where the platform is asserting *this was checked*.
- **Verified Green Deep** (`#00745c`): the readable green. All green text — cell links, kicker index numbers, eyebrows, trace glyphs — uses this step, never the anchor, because the anchor fails contrast on white at small sizes.
- **Verified Green Bright** (`#00c9a0`): the light end. Used only inside gradients and on dark grounds (code islands, the dark product screenshot frame).
- **Verified Green Ink** (`#03271e`): the text colour that sits *on* green fills, chiefly the primary button label.
- **Sheen Mint** (`#7dffdb`): appears in exactly one place — the highlight that sweeps across the word LACE once on first paint. Not a palette member; a single authored moment.

### Secondary — product semantics, not brand
Neither of these is a brand colour; both are reserved for states the platform reports, and neither ever appears as decoration or as a second accent.

- **Flag Amber** (`#d99a06`, ink `#7a5200`, fill `rgba(255, 216, 111, 0.12)`, border `rgba(196, 132, 12, 0.4)`): the *contested* signal — an unresolved contradiction, a value that disagrees across sources.
- **Flag Denied** (`#c2544a`): the *absent or denied* signal — a capability that does not exist, an action the system refuses, a path with no API to misuse. Always accompanies a glyph or label (`✕`); the colour reinforces, never carries, the meaning.

### Neutral
- **Sheet** (`#f6f7f9`): the page ground. Carries a 48px blueprint grid at 2.8% and three soft green radial washes.
- **Surface** (`#ffffff`): fragment windows, evidence tiles, translucent chrome. In this system white is *raised* material, not the default ground.
- **Ink** (`#0e1210`): headings and emphatic values. A green-biased near-black, never pure `#000`.
- **Ink Soft** (`#2d3748`): lead paragraphs and evidence body text.
- **Muted** (`#4a5568`): standard body copy.
- **Faint** (`#656f7c`): mono labels, window titles, tick marks, and the large editorial statement type. The lightest ink permitted on text.
- **Hair** (`rgba(13,27,22,0.09)`) and **Hair Soft** (`rgba(13,27,22,0.055)`): the rules the page is drawn with. Distinct from `line` / `line-soft`, which belong to raised surfaces.

### Named Rules

**The Earned Green Rule.** Green marks something the system verified — a matched citation, a resolved fact, a passing gate, a surveyed junction. It never marks something we merely want the visitor to click. If you cannot name what was checked, use ink.

**The Three-Signal Rule.** Green means verified, amber means contested, red means denied or absent. That is the complete set. A fourth state does not get a fourth hue — it gets a label.

**The Deep-Green-For-Text Rule.** Green text is always `#00745c` (5.36:1 on the sheet). `#00a882` measures 2.83:1 and is a marking colour only — rules, dots, fills, highlights — never small text.

**The Measured-Neutral Rule.** Every ink step clears 4.5:1 on the sheet: Faint 4.76:1, Muted 7.02:1, Ink Soft 11.18:1. Faint is the floor of the system; nothing lighter than `#656f7c` may carry text.

## Typography

**Display Font:** Space Grotesk (with Red Hat Display, then system sans)
**Body Font:** Space Grotesk (the same family, at lower weights and sentence-length measure)
**Label / Mono Font:** JetBrains Mono

**Character:** A single geometric grotesk carries the whole page, set uppercase and tightly tracked at every heading level so that headings read as annotations on a drawing rather than as magazine display. JetBrains Mono is not a costume here — it appears only where the page is *reporting a value*: section indices, source citations, window titles, timestamps, tick marks. The pairing is a drafting hand and a readout.

### Hierarchy
- **Display** (400, `clamp(2.6rem, 7.4vw, 5.6rem)`, line-height 0.97, tracking -0.03em, uppercase): the home hero headline only. One per site.
- **Headline** (500, `clamp(2rem, 4.2vw, 3.2rem)`, line-height 1, tracking -0.025em, uppercase): page-opening H1s.
- **Editorial** (400, `clamp(1.7rem, 3.4vw, 2.65rem)`, line-height 1.15, uppercase, colour Faint, max 46ch): the large statement paragraph that carries an argument in place of body copy. Its weight steps up to 500 and its colour to Muted on the phrase that matters.
- **Title** (400, `clamp(1.35rem, 2.3vw, 1.8rem)`, line-height 1.05, uppercase): the H2 inside a cell.
- **Body** (400, 0.95rem, line-height 1.6, colour Muted): cell copy. Kept to roughly 2–3 sentences; this system argues with product surfaces, not paragraphs.
- **Lead** (400, `clamp(1rem, 1.5vw, 1.22rem)`, line-height 1.6, balanced, max 480–660px): the single subhead under a hero.
- **Label** (500, 0.6rem, tracking 0.2em, uppercase, JetBrains Mono, colour Faint): the cell kicker. Its leading index number is weight 600 in Verified Green Deep.
- **Eyebrow** (500, 0.62rem, tracking 0.28em, uppercase, JetBrains Mono, colour Verified Green Deep): one per page, above the hero headline.
- **Readout** (400, 0.54–0.6rem, tracking 0.08–0.12em, JetBrains Mono, colour Faint): inside fragment windows — source citations, filenames, timestamps, tick labels.

### Named Rules

**The Uppercase-Heading Rule.** Every heading level is uppercase. There is no sentence-case heading in this system; a sentence-case H2 is the single fastest way to make a page look like it came from somewhere else.

**The Mono-Is-A-Readout Rule.** JetBrains Mono is used only where the page reports a value the system produced: an index, a source, a path, a time, a measurement. Prose never becomes mono to look technical.

**The Two-Weights Rule.** Space Grotesk runs at 400 and 500 across the whole system, with 600 reserved for the green index number. Emphasis comes from case, colour, and scale — not from bolder weights.

## Layout

The page is drawn inside a fixed frame: `min(1180px, calc(100% - 3rem))`, centred. Above 1080px the frame renders its own vertical rails as 1px hairlines at the left and right edges, and every section inside it draws a 1px top rule. Where a section rule meets a rail, a `+` in JetBrains Mono (0.85rem, Verified Green at 65%) sits astride the junction — offset `-0.34em` horizontally and `-0.72em` vertically so it centres on the crossing rather than hanging off it. The hero is exempt: it has no top rule and no crosshairs.

Below 1080px the rails and crosshairs disappear and the section rules remain. This is deliberate — a drawing without margins is just a list, and at phone width the honest form is a stack.

Content sits in **cells**, not containers. A cell is a flex column with `1.8rem` gaps and `clamp(2.2rem, 4.5vw, 3.6rem)` vertical by `clamp(1.2rem, 3.5vw, 3.2rem)` horizontal padding. Cells are grouped into rows of two, divided by a 1px vertical hairline; the row itself carries a top hairline. A full-width cell centres its content. The cell link is pushed to the bottom with `margin-top: auto` so links align across a row regardless of copy length. Below 780px rows collapse to one column and the dividing rule flips from left border to top border.

Vertical rhythm is set by the cell padding clamp rather than by section margins, so the ruled grid stays continuous — there is never a gap between a rule and the content it bounds. The editorial statement block is the one exception, taking `clamp(4rem, 8vw, 6.5rem)` of vertical air because its job is to slow the reader down.

The hero breaks the frame entirely: full-bleed, `200svh` tall, with a sticky pinned headline and a scroll-driven screenshot that rises from below and passes over the copy. Under `prefers-reduced-motion` the pin is released, the section collapses to auto height, and the screenshot becomes a static image below the headline.

## Elevation & Depth

**This system is flat.** The page is a drawing; a drawing has no depth. Structure comes from 1px hairlines, and separation comes from the rules and the generous cell padding. There is no card, no resting shadow on a content container, and no hover lift on a text block.

Exactly one family of elements is allowed to leave the sheet: the **product fragment window**, because it is the only element on the page that is evidence rather than argument. It earns its lift by being a picture of the real product.

### Shadow Vocabulary
- **Fragment lift** (`box-shadow: 0 26px 60px -24px rgba(15, 30, 26, 0.3)`): the fragment window only. A long, soft, far-offset drop — the shadow of something held above a sheet, not a glow.
- **Evidence rest** (`box-shadow: 0 1px 2px rgba(15,30,26,0.05), 0 2px 12px rgba(15,30,26,0.05)`): the small tiles *inside* a fragment window (evidence quotes, fact rows). Barely-there, two-layer, neutral.
- **Screenshot frame** (multi-layer, including `inset 0 1px 0 rgba(255,255,255,0.22)` and `inset 0 -1px 0 rgba(0,0,0,0.72)`): the dark hero screenshot bezel only. Inset highlights simulate a physical device edge.

### Named Rules

**The Flat-Sheet Rule.** If an element contains words the page is asserting, it is flat. If it contains a picture of the product, it may lift. Nothing else casts a shadow.

**The No-Glow Rule.** Shadows are neutral and offset. A coloured, zero-offset halo is decoration; this system does not use one. (The `0 8px 22px -10px rgba(0,168,130,0.65)` green shadow under the legacy primary button is inherited from the retired card system — see Components.)

## Shapes

Corners are nearly square and the radius scale is short and meaningful:

- **`0` — the sheet.** Cells, rules, section boundaries, and the frame have no radius at all. The grid is orthogonal.
- **`3px` — controls.** Buttons, chips, small pills, badges, mono status tags. Just enough to read as a manufactured part rather than a cut edge.
- **`6px` — tiles.** Evidence quotes, fact rows, and scrubber panels *inside* a fragment window.
- **`10px` — the window.** The fragment window itself, and only it. The largest radius in the system belongs to the one element that represents software.
- **Circles** are reserved for status: the 0.32–0.55rem dots on chips, trace steps, window bars, and flags.

Borders are 1px and never more. There is no coloured left-border rail on any element; emphasis on a cell comes from its index number and its position in the grid, not from a stripe.

## Components

### Cell
The system's fundamental unit, and the replacement for the card.
- **Shape:** no radius, no background, no shadow. Bounded by the grid's hairlines.
- **Structure:** flex column, `1.8rem` gap — kicker + H2 + body, then an optional fragment, then the link pinned to the bottom.
- **Padding:** `clamp(2.2rem, 4.5vw, 3.6rem)` × `clamp(1.2rem, 3.5vw, 3.2rem)`.
- **Grouping:** two per row, divided by a 1px vertical hairline; the row carries a top hairline. Collapses to one column below 780px.
- **Full-width variant:** centres its content and its link.

### Cell Kicker
- **Style:** JetBrains Mono, 0.6rem, weight 500, 0.2em tracking, uppercase, Faint.
- **Index:** a leading `<b>` number (`01`, `02`) at weight 600 in Verified Green Deep, `0.4rem` right margin. The index is the offering number, so it repeats across cells that describe the same offering — it identifies, it does not count.

### Buttons
- **Shape:** 3px radius, `1rem 2rem` padding (`1.15rem 2.5rem` large), JetBrains-adjacent uppercase label at 0.76rem / 0.12em.
- **Primary:** `linear-gradient(135deg, #00b88d, #00d9ae)` with Verified Green Ink text.
- **Hover:** the fill flips to Ink with white text and lifts 1px — the accent *withdraws* on interaction rather than intensifying, which keeps the green tied to state rather than to attention.
- **Ghost:** translucent white with `backdrop-filter: blur(8px)` and a `rgba(13,27,22,0.18)` border; on hover the border takes Verified Green and the label takes Verified Green Deep.
- **Cell link:** not a button. Mono, 0.66rem, weight 600, uppercase, Verified Green Deep, with a trailing `→`; fades to 70% opacity on hover.

### Fragment Window
The signature component — a cropped picture of the real product, one per cell.
- **Shape:** 10px radius, 1px `line` border, white, `min(460px, 100%)` wide, `margin-block: auto` so it centres in the cell's leftover space.
- **Title bar:** `#f6f7f8`, three 0.55rem dots (`#f57d72`, `#f5c94e`, `#55ca77`), and a centred mono 0.58rem label naming the surface (`graph.lace — conflict review`).
- **Body:** grid with `0.65rem` gaps, `clamp(0.9rem, 2vw, 1.2rem)` padding.
- **Inner tiles:** 6px radius, white, `--lp-shadow-sm`, mono citation label above a 0.76rem quote.
- **Evidence highlight:** `<mark>` at `rgba(0,168,130,0.16)` for the verified value; `rgba(255,190,70,0.3)` for the contested one.
- **Rule:** the window always shows a *specific* record — a named contract, a section number, a real-looking timestamp — never a generic placeholder.

### Conflict Flag
- **Style:** 6px radius, `rgba(255,216,111,0.12)` fill, `rgba(196,132,12,0.4)` border, `#7a5200` text at 0.74rem/500, with a `#d99a06` dot that blinks on a 2s cycle.
- **Content:** always states the count and the resolution path (`1 conflict open · routed to counsel@ for ruling`). A flag that names a problem without naming who resolves it is incomplete.

### Chips & Status Tags
- **Chip:** 3px radius, translucent white, `rgba(0,168,130,0.3)` border, mono-adjacent 0.6rem uppercase at 0.14em, preceded by a 0.32rem Verified Green dot.
- **Mono tag:** 3px radius, `rgba(0,168,130,0.4)` border, transparent fill, 0.56rem JetBrains Mono in Verified Green Deep. Used for machine values inside fragments.

### Navigation
- **Style:** fixed, transparent at rest; background, hairline, and `blur(14px)` all interpolate from a `--np` scroll-progress custom property set by JS, so the bar materialises as the page moves rather than snapping.
- **Links:** 0.7rem uppercase at 0.16em, Muted; hover takes Verified Green Deep. The current page takes Ink and a 2px gradient underline.
- **Brand:** 0.98rem, weight 700, `0.26em` tracking — LACE is always locked-up wide.
- **Megamenu:** three columns divided by hairlines, columns staggered in at 40/110/180ms, over a `rgba(10,16,13,0.32)` blurred veil. Collapses to a `<details>` accordion below 880px.

### Retired: the card system (`.lp-*`)
`packages/site-kit/src/styles/lace-site.css` implements the previous generation — white cards at 6px radius with two-layer shadows, a 3px hover lift, Space Grotesk kickers at 0.3em, and gradient-clipped accent words (`.lp-accent`). It still ships on pricing, docs, contact, 404, and all four platform offering pages.

**It is not the system.** Treat it as an incumbent being retired. Do not extend it, and do not add new `.lp-card` instances. When a page in that set is next worked on substantively, migrate it to the ruled grid rather than polishing the card. Nav, footer, and the CTA band in that stylesheet are shared and stay in service.

## Do's and Don'ts

### Do:
- **Do** build sections as cells in the ruled frame — 1px hairlines, `+` crosshairs at the junctions, no container around the content.
- **Do** set every heading in uppercase Space Grotesk at weight 400–500 with negative tracking.
- **Do** reserve JetBrains Mono for values the system reports: indices, sources, paths, times, measurements.
- **Do** spend green only where something was verified, and use `#00745c` for any green text.
- **Do** pair every claim with a fragment window showing the real surface that proves it, with a specific record inside.
- **Do** let the fragment window be the only element that lifts off the sheet.
- **Do** use amber (`#d99a06` / `#7a5200`) for contested or conflicting state, and state the resolution path alongside it.
- **Do** keep cell copy to two or three sentences; the product surface carries the argument.
- **Do** give the hero's motion a full `prefers-reduced-motion` fallback that releases the pin and collapses the section to auto height.

### Don't:
- **Don't** add a card. No white rounded container with a resting shadow holding text — that is the retired system.
- **Don't** put a shadow, glow, or hover lift on anything that contains an assertion rather than a product image.
- **Don't** set a heading in sentence case.
- **Don't** introduce a third accent hue. Green is verified, amber is contested; a new state gets a label, not a colour.
- **Don't** use `#00a882` as small text on the sheet — it fails AA. It is a marking colour.
- **Don't** use a coloured `border-left` rail to emphasise a cell; the index number and grid position do that job.
- **Don't** put monospace on prose to make it feel technical.
- **Don't** add a second scroll-driven or pinned moment. The hero screenshot rise is the site's one authored motion; everything else is a state transition of 160–280ms.
- **Don't** invent customer logos, metrics, or testimonials to fill a cell — none exist (see PRODUCT.md). An empty cell is better than a fabricated one.
