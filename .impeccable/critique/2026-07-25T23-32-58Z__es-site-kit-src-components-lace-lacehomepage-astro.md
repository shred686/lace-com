---
target: LACE homepage
total_score: 22
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 3
timestamp: 2026-07-25T23-32-58Z
slug: es-site-kit-src-components-lace-lacehomepage-astro
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | 200svh pinned hero gives no scroll-progress cue |
| 2 | Match System / Real World | 4 | Real enterprise vocabulary (MSA, counsel@, renewal clause) |
| 3 | User Control and Freedom | 2 | Scroll-jacked hero has no visible skip affordance |
| 4 | Consistency and Standards | 3 | Anchor targets land under the fixed nav; docs page solves this, nothing else does |
| 5 | Error Prevention | 3 | Whitepaper link gives no file-type/size cue |
| 6 | Recognition Rather Than Recall | 4 | Kicker index numbers reinforce offering identity |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no power-user path expected |
| 8 | Aesthetic and Minimalist Design | 3 | Three large cells spent on unavailable products |
| 9 | Error Recovery | n/a | No user-generated errors possible |
| 10 | Help and Documentation | n/a | Not a task surface; Docs is its own nav item |
| **Total** | | **22/28** | **Good (79%)** |

## Design Specificity Verdict

Authored for this product, with one significant lapse.

The ruled-grid/crosshair system, uppercase labels-as-annotations, rationed green, and above all the fragment windows showing named specific records (MSA-2024 §7.1 vs a summary deck; "$2.40 of $40 daily budget"; "routed to counsel@ for ruling") are not swappable into another product. The content of the evidence IS the argument.

The lapse: the App Builder "Launch" panel is a stock MRR/billing dashboard with invented figures. It is the one moment that reads as borrowed rather than authored, and it collides with PRODUCT.md's no-fabricated-proof constraint.

Deterministic scan: detector returned ZERO findings on components/lace. Every issue below was found by design review or browser measurement, not by the linter — the detector cannot see fabricated proof, scroll-jacking, or an anchor offset.

## Priority Issues

**[P1] The App Builder MRR dashboard invents business-performance figures.** "$4,280 MRR ↑18% this month", "84 subscribers", "45 subscribers", "$3,905 payout Fri" for a fictional flowlane.app. PRODUCT.md forbids generating ROI/metric claims. Judgment call: it is a mockup of a hypothetical customer's app rather than a LACE claim, which is a common convention — but it is exactly the artifact a hostile second reader screenshots and demands a source for. Fix: show the confirmed capability (domain registered, entity formed, launch checklist state) instead of invented revenue.

**[P1] Every in-page anchor lands 70px under the fixed nav.** scroll-margin-top is 0 everywhere except LaceDocsPage. Affects /applications#built-on-lace, /customers#federal, /docs#* — and the skip link #lp-main added in the last pass, so the a11y fix currently drops keyboard users onto occluded content. Fix: scroll-margin-top: calc(nav height + 0.8rem) on section/heading targets, matching the docs precedent.

**[P1] "Built on LACE" spends the persuasion peak on vaporware.** Three cells up to 540px tall, each resolving to "Coming soon", link commented out, positioned late in the arc where momentum toward /contact should build. Corroborated independently: those "Coming soon" pills measure 1.90:1 contrast, the worst on the page. Fix: compress to one strip, move below the CTA, or cut until an edition ships.

**[P2] Seven text elements fail WCAG AA, all inside megamenu and demo fragments.** "Coming soon" pill 1.90:1 (x3); EM "Approval required" 3.36:1; MARK "ninety (90) days" 3.95:1; .lp2-handoff 3.95:1; hero "Governed." 2.83:1 against a 3.0 large-text threshold. The last is the brand headline word. These sit outside main page flow, which is why the earlier audit missed them.

**[P2] Two chunking violations break the page's own restraint.** Governance tag row shows 5 items; channel grid shows 8 icons at once. Both exceed the working-memory limit on a page that otherwise holds to 2-3 items per idea.

**[P2] Deploy diagram: Air-Gapped chip collides with the "Your data" core.** At both viewports the chip's bottom edge sits against the core pill with the dashed ring slicing through both. This diagram illustrates the single most defensible confirmed claim; a diagram that looks broken undermines it.

## Persona Red Flags

**Jordan (first-timer):** no progress cue through the 200svh hero — may think the page stalled. Two adjacent cells share the identical "02 Knowledge Graph" kicker with no differentiator, reading as a duplicated block. The editorial statement colours only "AUTOMATE REAL WORK", so the other three offerings sit at equal faint weight and get skipped.

**Riley (stress tester):** will screenshot the MRR panel and ask whose numbers those are. Will spot the Air-Gapped/core overlap in the section selling engineering rigor. Will click the three "Coming soon" cards — styled and sized like product cards — and hit a dead end.

**Casey (mobile):** a full extra screen of dead scroll before the hero payoff on 390px; a fast thumb bails first. The 8-icon channel grid compresses to "lots of icons" rather than which channels are supported.

## What's Working

- **Specific-record fragment windows.** Named records make it read as a screenshot of real software — exactly what a hostile second reader needs when the product has no customer proof to lean on.
- **The ruled grid as literal metaphor.** The manufacturing-line positioning is drawn, not merely claimed. Structure and argument are the same object.
- **Green discipline.** Because green fires only where something was verified, it carries meaning instead of decorating.
- **Motion accessibility.** All 10 infinite animations are covered by matching prefers-reduced-motion overrides. Zero uncovered.
- **Clean measurement baseline.** Zero detector findings, zero console errors, 1 h1, no heading skips, no touch targets under 24px, skip link present and resolving, no document-level overflow at either viewport.

## Minor Observations

- Footer "Customer stories — coming soon" carries the same visual weight as adjacent links but is not one; invites a mis-click.
- Whitepaper CTA gives no PDF/size cue before opening a new tab.
- Hero subhead lists four things at equal weight, diluting the most valuable real estate.
- The single mint sheen across "GOVERNED" is well-executed; preserve it if the hero is simplified.
- 1 image lacks loading=lazy — correct, it is the LCP hero.

## Questions to Consider

1. If zero customers exist and fabricated proof is banned, is an invented MRR dashboard meaningfully different from a fake logo wall, or the same instinct in a different costume?
2. The page gives more vertical weight to three unreleased products than to the deployment-boundary axis PRODUCT.md calls first-class. Does the IA reflect the stated priority, or did the vaporware section win the layout by being satisfying to build?
3. Would a hostile reader trust the page more if the pinned-scroll spectacle and the "Coming soon" section were both cut, in exchange for one more real fragment window per offering?
