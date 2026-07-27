# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: enterprise and public-sector technology buyers evaluating an AI platform for an organization that cannot deploy an ungoverned one — CIO/CTO, head of data or AI, enterprise architect, and the security, compliance, or accreditation reviewer who has veto power over the decision. They arrive mid-evaluation, usually comparing LACE against a general assistant, a search vendor, and a build-it-ourselves plan, and they are looking for the specific reasons this can pass review inside a regulated boundary.

Secondary: the practitioner who will actually run it — the developer or domain expert who wants to know what the App Builder and `lace-app-sdk` let them ship, and how fast.

The job: leave the site able to argue internally that LACE is the right platform, and book a conversation with sales.

## Product Purpose

laceplatform.com is the marketing and evaluation site for LACE, an enterprise AI platform sold by Determinant Systems. LACE unifies four offerings on one governed substrate:

- **Enterprise Search** — permissions-aware search across company knowledge, enforced at query time.
- **Knowledge Graph** — an evidence-locked, bitemporal graph that turns documents into queryable facts and relationships.
- **Agent Studio** — policy-governed AI agents across web chat, email, Slack, Microsoft Teams, SMS, WhatsApp, and voice, sharing one set of permissions, evidence, and approval paths.
- **App Builder** — turns a prompt into deployed software, with hosting and developer access through `lace-app-sdk`.

Success for the site is a qualified inbound conversation: every tier and every offering page routes to `/contact`, not to a signup. There is no self-serve funnel to optimize.

## Positioning

Governance is in the runtime, not in the prompt. LACE's claim is that provenance on every output, permissions enforced at query time, a complete audit trail, budgets and approval gates, and evaluation/monitoring are properties of the platform itself — so an agent that is not authorized to reach a source finds that capability unavailable rather than merely discouraged. A competitor bolting a policy prompt onto a model API cannot truthfully make that claim.

The second half of the position is the deployment boundary: the same platform runs in managed cloud, private cloud (VPC), on-premises, and fully air-gapped with no external AI calls. Most governed-AI competitors give up one end of that range.

## Operating Context

- Buyers evaluate in a committee. Pages are read by a technical champion first, then forwarded to security/compliance — so claims must survive a second, more hostile reading.
- The whitepaper (`LACE_Enterprise_Overview_v3.pdf`, in site-kit assets) is the deep-evaluation artifact the site hands off to; English and Spanish v2 overviews also exist.
- Contact is the single conversion for every path, including all three pricing tiers.
- The site is a static Astro build in an npm workspace, deployed to Cloudflare Pages; it shares `packages/site-kit` (layout, styles, components, assets) with determinantsystems.com. Changes to site-kit affect both sites.
- SEO invariants are enforced by `npm run check:seo` and documented in `docs/SEO-STRATEGY.md`: indexability, canonicals, sitemap parity, unique titles and descriptions, exactly one `h1` per page, robots declarations, valid JSON-LD. Any new or restructured page must keep these passing.

## Capabilities and Constraints

- Surfaces today: home, product, four platform offering pages (enterprise-search, knowledge-graph, agents, app-builder), applications, pricing, docs, blog + posts, contact + success, 404.
- Packaging is deployment-scope-led, in three tiers — Cloud, Enterprise (featured, "Most deployed"), Government & Defense — plus a feature comparison table. **There is no public rate card.** No dollar figures are committed; pricing beyond this packaging shape is an open product decision and must not be invented.
- LACE is a product of Determinant Systems, not its own organization. Structured data models it as a `SoftwareApplication` published by the Determinant Systems org (`https://determinantsystems.com/#organization`); LACE's homepage is the only page emitting the org/website graph.
- Terminology to use consistently: *provenance*, *permissions enforced at query time*, *audit trail*, *approval gates*, *budgets*, *evidence-locked*, *bitemporal*, *governed*. Avoid "deterministic" as a blanket product claim on this site — it belongs to the pipeline layer, not to search or agents.
- Legacy framing in `docs/`: LACE as "Long-Form Artifact Construction Engine," a long-form document generation engine, with an alpha/early-pilot CTA and "Hosted SaaS (coming soon)." **This is superseded.** The platform framing in `apps/lace/src/site.config.ts` is current truth. Do not resurrect LFACE naming, the alpha-program CTA, or the coming-soon deployment list from `docs/LACE-LANDING-PAGE-CONTENT.md`, `LACE_GENTLE_INTRO.md`, or `LACE BUSINESS PLAN.md` — read those for mechanism detail only.

## Brand Commitments

- Name is **LACE** (all caps), always. Publisher is Determinant Systems.
- Domain `laceplatform.com`; contact `info@laceplatform.com`, +1 (727) 282-4564.
- Voice: plain, specific, and unhyped. The existing copy earns trust by naming exactly what the system does and does not do ("Prompt instructions are not a security boundary") rather than by adjectives. No emoji in shipped copy, whatever the source docs use.
- Existing assets: favicon set, `og-image.png`, `kg-assistant.mp4` + poster, product screenshots and knowledge-graph/workflow imagery in `packages/site-kit/src/assets/images`.

## Evidence on Hand

Real and usable:

- Deployment claims — managed cloud, private cloud (VPC), on-premises, and fully air-gapped with no external AI calls — are genuinely supported and sellable today. **Confirmed.**
- The four platform offerings as described above, plus `lace-app-sdk` developer access.
- `LACE_Enterprise_Overview_v3.pdf` (English), v2 English and Spanish overviews.
- Product screenshots, the knowledge-graph assistant video, and workflow imagery listed above.

Absences future work must not fabricate:

- **There are no named customers, logos, testimonials, case studies, or press.** Never invent them, and do not use placeholder logo walls, "trusted by" strips, or invented quotes as layout devices.
- No committed public pricing figures.
- No benchmark numbers, accuracy percentages, latency figures, customer counts, or ROI claims exist. Do not generate them.
- No certifications or accreditations (FedRAMP, SOC 2, IL levels, ATO) are confirmed. Do not imply any.

Open evidence question (resolve before relying on it):

- The pricing page currently claims **"High-touch delivery by a team with DoD/USAF pedigree"** and **"BFO/CCO ontology conformance artifacts"**, and `docs/` references an active DoD/USAF ontology pipeline. This was **not confirmed as publicly claimable**. Treat it as unverified: do not extend it, repeat it on new surfaces, or build a proof section around it until confirmed.

## Product Principles

1. **Governance is the product, not a feature strip.** Every offering page should show the control — permission, provenance, gate, audit — as part of how the thing works, not as a compliance footnote after the fun part.
2. **Survive the second reader.** Copy is written for a technical champion and re-read by a security reviewer. Prefer a specific mechanism over a superlative; a claim that cannot be substantiated is a liability, not a headline.
3. **Four offerings, one substrate.** Each offering must be legible on its own and visibly the same system as the other three. Never let the set read as four separate products.
4. **The deployment boundary is a first-class selling axis.** Cloud → on-prem → air-gapped is how buyers self-identify; it drives packaging, so it should drive structure.
5. **No fabricated proof, ever.** With no customers or numbers on hand, credibility comes from the depth and precision of what is shown — real product surfaces, real artifacts — not from borrowed social proof.

## Accessibility & Inclusion

No product-specific standard has been established. Public-sector buyers make Section 508 / WCAG 2.1 AA a likely procurement requirement; treat AA as the working floor until the user says otherwise. Site content is English only (unlike the Determinant site, which ships English and Spanish).
