# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the person inside a mid-to-large organization who has been handed the AI mandate and does not have the team to deliver it — a CIO/CTO, head of data or AI, VP of engineering, or an operations leader who owns a specific painful process. They have already tried a pilot, or watched one stall, and they are looking for an engineering partner who will leave behind a working system rather than a strategy deck.

They arrive by search, usually on a specific service term ("enterprise AI agent development", "RAG", "enterprise search", "knowledge graphs"), not on the homepage. The service pages are the front door.

Secondary: the security, compliance, or risk reviewer the buyer must bring along, and Spanish-speaking buyers reached through the `/es/` homepage.

The job: decide this firm is credible enough to talk to, and start a scoping conversation.

## Product Purpose

determinantsystems.com is the site for Determinant Systems, an enterprise AI engineering and consulting firm. It sells six services — AI agent development, custom AI application development, AI workflow automation, retrieval-augmented generation, enterprise search, and knowledge graphs — delivered as engagements, and it establishes the firm as the publisher of LACE.

Success is a scoping conversation with a qualified buyer. There is no product to sign up for; every path resolves to contact.

## Positioning

Determinant sells the layer between the model and the business: "We build the layer between AI models and your business." The differentiator is that the delivery work runs on LACE, the firm's own enterprise AI platform — so an engagement does not start by rebuilding identity, ingestion, retrieval, deployment, and run history. The team spends its time on the business process, evidence, controls, and user experience instead.

That is a claim a generalist consultancy cannot truthfully make, and it is the reason to choose this firm over a systems integrator or a staffing shop. The corollary commitment, stated in the existing copy: the engagement leaves "a working, inspectable system — not a slide deck or isolated demo."

## Operating Context

- Search is the primary acquisition channel; the six service pages carry the commercial weight and are built from `apps/determinant/src/data/services.ts` (eyebrow, title, lede, sections, FAQs) rendered through a shared interior-page component. New service content belongs in that data file, not in bespoke page markup.
- Buyers are in an evaluation committee. Copy is read by a technical champion and re-read by security or procurement.
- Bilingual: `inLanguage: ["en", "es"]`, with a Spanish homepage at `/es/`. Home content is authored as locale-keyed data (`packages/site-kit/src/data/homeNewContent.ts`), so any home-surface change must be answerable in both locales or explicitly scoped to one.
- Static Astro build in an npm workspace, deployed to Cloudflare Pages; shares `packages/site-kit` with laceplatform.com. Site-kit changes affect both sites — verify the LACE site when touching shared layout, styles, or components.
- SEO invariants are enforced by `npm run check:seo` and documented in `docs/SEO-STRATEGY.md`: indexability, canonicals, sitemap parity, unique titles and descriptions, exactly one `h1` per page, robots declarations, valid JSON-LD. Every service page also emits breadcrumb, service, and FAQ structured data; keep it intact.
- The repo contains exploratory theme routes under `src/pages/themes/` (blueprint, midnight, forge, circuit, review) and a `home-new` variant. These are internal exploration, not committed identity.

## Capabilities and Constraints

- Surfaces today: home (en + es), about, services index, six service detail pages, contact + success, 404, plus the internal theme explorations noted above.
- Services are engagements, not SKUs. **No pricing, rates, package tiers, or timelines are published or committed.** Do not invent them.
- The firm is the schema.org `Organization` of record for both sites: `https://determinantsystems.com/#organization`. LACE's markup references this same `@id` as its publisher, so the org node must stay stable — renaming or re-`@id`-ing it silently breaks the LACE site's structured data.
- Terminology used consistently across the service pages: *governed*, *permissions*, *approval gates*, *evidence*, *provenance*, *execution trace*, *audit*, *evaluation*. The firm's stated stance — "Prompt instructions are not a security boundary" — is a load-bearing line, not decoration.
- Relationship to LACE must stay accurate in both directions: Determinant Systems is the company and publisher; LACE is its platform. Determinant's site does not resell LACE as self-serve software, and LACE's site does not present itself as a separate company.

## Brand Commitments

- Name **Determinant Systems**; domain `determinantsystems.com`; contact `info@determinantsystems.com`, +1 (727) 282-4564. LinkedIn (`determinant-systems-inc`) and GitHub (`Determinant-Systems`) are the confirmed `sameAs` profiles.
- Voice: measured, concrete, engineering-first. Existing copy makes its case by describing mechanism and boundary ("Tools, data, budgets, and model choices are bounded by the surrounding system") and consistently declines hype. Match that register.
- Existing assets: favicon set and `og-image.png`.

## Evidence on Hand

Real and usable:

- The six services as documented in `services.ts`, including their FAQ answers.
- LACE as a genuine in-house platform behind delivery — the firm's strongest and most defensible proof point.
- Deployment across cloud, private cloud, on-premises, and air-gapped environments. **Confirmed as real and sellable today.**

Absences future work must not fabricate:

- **There are no named clients, logos, testimonials, case studies, or press.** Never invent them, and do not use placeholder logo walls or "trusted by" strips as layout devices.
- No team bios, headcount, founding date, office locations, or credentials are recorded here. Do not state any without confirmation.
- No project counts, engagement durations, outcome metrics, accuracy figures, or ROI numbers exist. Do not generate them.
- No certifications, partnerships, or clearances are confirmed. Do not imply any.

Open evidence question (resolve before relying on it):

- DoD/USAF experience is referenced elsewhere in the repo and on the LACE pricing page but was **not confirmed as publicly claimable**. Do not introduce it on this site until confirmed.

## Product Principles

1. **Service pages are the product.** They are the landing surface for real demand; depth, specificity, and structured data on those six pages outrank homepage expression.
2. **Sell the engineering stance, not AI enthusiasm.** The buyer has heard the promise already. What converts is a precise account of how authority, evidence, and failure are handled.
3. **LACE is the proof.** Every credibility argument routes back to the fact that this firm built the platform it delivers on. Keep that link visible without turning the consulting site into a product site.
4. **Credibility without borrowed proof.** With no clients or numbers to cite, trust has to come from the specificity of the thinking on the page. Never paper over the gap with fabricated social proof.
5. **Both locales, one firm.** Spanish is a real audience, not a translation afterthought; structural work on shared home surfaces must account for it.

## Accessibility & Inclusion

No product-specific standard has been established. Enterprise and public-sector procurement makes WCAG 2.1 AA the sensible working floor. Spanish-language support is a confirmed audience requirement on the home surface (`/es/`).
