# LACE Website Copy Proposal

**Status:** Proposal only — no pages were changed.
**Source repo:** `/home/mkern/LACE/` · **Site repo:** `/home/mkern/lace-com/` (`apps/lace` → `laceplatform.com`)
**Audience for this doc:** Determinant leadership, LACE product + marketing, and whoever writes the next Astro build.
**Lens:** A buying committee that has to defend this purchase to someone who can kill it.

---

## Table of contents

1. [What this proposal is](#1-what-this-proposal-is)
2. [Why the current site is already strong — and where it leaks](#2-why-the-current-site-is-already-strong--and-where-it-leaks)
3. [What LACE actually is, in one breath](#3-what-lace-actually-is-in-one-breath)
4. [The wedge: what makes LACE different and hard to copy](#4-the-wedge-what-makes-lace-different-and-hard-to-copy)
5. [Who is reading, and what job each page has](#5-who-is-reading-and-what-job-each-page-has)
6. [Voice, guardrails, and what we will not say](#6-voice-guardrails-and-what-we-will-not-say)
7. [Master positioning & tagline bank](#7-master-positioning--tagline-bank)
8. [Site-wide changes that touch every page](#8-site-wide-changes-that-touch-every-page)
9. [Home — `/`](#9-home---)
10. [Platform — Enterprise Search — `/platform/enterprise-search`](#10-platform--enterprise-search---platformenterprise-search)
11. [Platform — Knowledge Graph — `/platform/knowledge-graph`](#11-platform--knowledge-graph---platformknowledge-graph)
12. [Platform — Agent Studio — `/platform/agents`](#12-platform--agent-studio---platformagents)
13. [Platform — App Builder — `/platform/app-builder`](#13-platform--app-builder---platformapp-builder)
14. [Applications hub — `/applications`](#14-applications-hub---applications)
15. [LACE-GOV — `/applications/lace-gov`](#15-lace-gov---applicationslace-gov)
16. [LACE Legal — `/applications/lace-legal`](#16-lace-legal---applicationslace-legal)
17. [LACE Finance — `/applications/lace-finance`](#17-lace-finance---applicationslace-finance)
18. [Pricing — `/pricing`](#18-pricing---pricing)
19. [Contact — `/contact`](#19-contact---contact)
20. [Docs hub — `/docs` (+ each doc page)](#20-docs-hub---docs--each-doc-page)
21. [Blog — `/blog`](#21-blog---blog)
22. [404 + small surfaces](#22-404--small-surfaces)
23. [SEO titles & descriptions (recommended)](#23-seo-titles--descriptions-recommended)
24. [What to measure, and what to build next](#24-what-to-measure-and-what-to-build-next)
25. [Appendix A — Differentiator → copy line map](#25-appendix-a--differentiator--copy-line-map)
26. [Appendix B — Competitor copy we are beating](#26-appendix-b--competitor-copy-we-are-beating)
27. [Appendix C — Files referenced](#27-appendix-c--files-referenced)

---

## 1. What this proposal is

This is **new copy for every public page on `laceplatform.com`**, written after a full read of the product as it actually ships — not the pitch deck version of it. Nothing in this doc has been applied to the Astro pages. It is meant to be lifted into `packages/site-kit/src/components/lace/*` and `apps/lace/src/pages/**/*` almost line-for-line.

What changed vs. a normal marketing rewrite: every headline was checked against what the code can defend under a security review. If the platform cannot prove it, the line is not in here.

---

## 2. Why the current site is already strong — and where it leaks

**What is working and should be kept:**

- The governed-line design language (hairline grid, cells, fragment windows, one earned green) is a real position — engineering-drawing credibility, not brochure gloss. It does commercial work for a committee sale. Do not redesign away from it.
- "Governance is in the runtime, not in the prompt" is the one sentence that reframes the whole market. It shows up implicitly; it deserves to be explicit on every page.
- The four-offerings-on-one-substrate architecture reads as one platform, not four products. The home page's Platform Map and the repeated "More of the platform" footer are load-bearing — keep them.
- Citations that open the passage, bitemporal history, approval gates, air-gapped mode — these are specific and checkable. Specificity is the moat when you cannot use logos or benchmark numbers.

**Where it leaks, from a buyer's point of view:**

| Leak | Why it costs you | Fix in this proposal |
|---|---|---|
| The hero says "Enterprise AI. Governed." — confident, but abstract. A CIO cannot forward that to a CISO and win the argument. | The first reader loves it; the second reader (who vetoes) is unmoved. | The new hero names the mechanism in the subhead: one substrate, four outputs, governed at the point of retrieval/dispatch. |
| "Four offerings in one paragraph" copy reads as a list, not as a reason to choose LACE over Glean + LangChain + Retool. | The BYO-stack buyer thinks "I can assemble this." | Each offering page now carries a named, owned antagonist: keyword search, vector-only graph, tool-use without a gate, generated app with no lifecycle. |
| App Builder reads as "vibe coding for enterprises." That phrase attracts the wrong buyer and scares the right one. | Enterprise vibe coding = uncontrolled blast radius to a risk reviewer. | New frame: "one prompt to a versioned, governed application" — the SDK boundary and the audited lifecycle are the headline, not the prompt. |
| Pricing reads as three feature columns with no opinion about who goes where. A buyer self-selects badly. | Unqualified inbound, longer sales cycle. | New pricing gives each tier a human and a boundary: Cloud = team that wants to start this month; Enterprise = regulated enterprise that needs its own VPC/racks; Gov = program where the internet is not allowed. |
| Docs speak to "the platform broadly" while marketing speaks to "four offerings." The seam is visible. | A builder lands in docs and wonders if it is the same product. | Docs hub reframed as "the same platform the marketing page describes, with the API names on." Every doc page now opens with a one-line bridge back to the platform page it implements. |
| Government, Legal, Finance vertical pages are strong but do not answer "why not buy a point solution for this vertical?" | A GC can buy a CLM; a CFO can buy a research tool. | Each vertical page now opens with the job the point tool cannot do because it is not on the knowledge substrate (cross-document obligations, restatement-safe history, table-native figures). |

---

## 3. What LACE actually is, in one breath

> **LACE is the governed AI platform that turns an organization's existing knowledge into searchable answers, an evidence-locked knowledge graph, policy-bound agents on every channel, and versioned applications — on one substrate, in any environment the buyer is allowed to run in.**

Read that again with the architecture underneath it:

```
React SPA / app runtime UI / chat, Slack, Teams, email, SMS, WhatsApp, voice
                           │
                    FastAPI control surface
                           │
      pipelines + task plane │ unified agent plane │ app + builder plane
                           │
                  tools / policy / memory / connectors
                           │
     datasets → parse → canonical blocks → projections → hybrid retrieval → knowledge graph
                           │
     Postgres + pgvector · object storage · Redis · NATS · telemetry · GPU reranker
```

Five peer surfaces, not a stack of wrappers: **Pipelines** (versioned typed graphs), **Agents** (definitions → deployments → executions), **Apps** (manifest-declared packages), **Knowledge** (datasets, enterprise search, schema extraction, graph), and **Assistant** (tenant-scoped copilot over the same APIs). They are peers over one control plane — an agent can call a pipeline, a pipeline can write to the graph, an app can ship all three.

The laws that matter to copy (from `docs/ARCHITECTURE.md` and `AGENT_ARCHITECTURE_GUIDE.md`):

1. **Tenant-scoped by default.** No resource escapes its tenant.
2. **Model proposes; deterministic service enforces.** Permissions, budgets, approvals, state transitions — the LLM never decides them. A separate service does.
3. **Evidence is first-class.** Retrieval and graph assertions point to document spans/blocks, not opaque chunks.
4. **Durable work never trusts HTTP.** Persisted attempts, checkpoints, idempotency, leases, dead-letter.
5. **Apps never import core; core never imports apps.** The manifest + SDK is the only boundary. The audit can be trusted because there is no secret bypass.

---

## 4. The wedge: what makes LACE different and hard to copy

Customers are comparing you to three things. The copy must beat all three without naming two of them.

| Buyer alternative | What it promises | Where it falls down | LACE's owned wedge (and the line that wins) |
|---|---|---|---|
| **ChatGPT / Claude / Copilot on top of drive** | "Just connect your docs" | No permission enforcement before the model reads; no lineage; no audit; no deployment choice. | **"Governance is in the runtime, not the prompt. A model cannot be talked around a permission it never receives."** (`src/lace/auth/policy.py`, `src/lace/agent/runtime`) |
| **Glean / Coveo / classic enterprise search** | Proven search, connectors | Keyword or vector, not both; no graph; agents and apps are someone else's problem; limited deployment boundary. | **"Hybrid retrieval that returns the value's table cell, period, unit, and filing — not a paraphrase."** (`src/lace/domain/rag/`, `src/lace/domain/enterprise_search/`, `src/lace/domain/table_family_compiler/`) |
| **LangChain / vector DB / DIY graph** | "Build exactly what you want" | You become the orchestration layer: no durability, no versioned contracts, no air gap, no accreditation evidence, no App SDK. You own the blast radius. | **"Typed pipelines, versioned graphs, durable execution, air-gapped mode, and a public SDK — the same platform runs in managed cloud and in a disconnected enclave."** (`src/lace/pipeline/definition.py`, `src/lace/execution/`, `infra/aws/`, `ecp/`) |

Four further wedges that rarely appear in competitor copy and should appear in *every* LACE surface:

- **Bitemporal knowledge graph.** Valid time vs. transaction time; corrections supersede without rewriting history; point-in-time queries. (`docs/agent/assertion-kernel.md`, `lace_schema.semantic_assertion_version` + truth ruling layer) → "Ask what the record showed on March 12, not just what it shows today."
- **Candidate-first, evidence-gated extraction.** Nothing enters the graph without a pointer to the span it came from; low-confidence work queues for review. → "A model's confidence is not enough to put a fact in the graph."
- **Single agent control plane across channels.** Web chat, Slack, Teams, email, SMS, WhatsApp, voice as normalized surfaces with consent, retry, handoff, and cost attribution per channel. (`src/lace/agent/product/channels/`) → "One agent, every channel — without rebuilding messaging infrastructure."
- **App Builder with an audited lifecycle.** Intent → architect → scaffold → validate → proof lanes → seal → publish. Isolated sandbox, SDK as the only capability surface, versioned releases, one-click rollback. (`src/lace/builder/`, `src/lace_app_sdk/`, `src/lace_runtime/`) → "Greenfield code that ships like product, not like a demo."

**What you do not claim yet** (guardrail — do not let copy invent it): no public logos, no named customers, no SOC 2 / FedRAMP / IL label, no latency or accuracy percentage. Those absent claims are load-bearing by their absence — a reviewer trusts you more for not making them prematurely.

---

## 5. Who is reading, and what job each page has

| Reader | Arrives saying | Needs to leave able to say | Page that must convert them |
|---|---|---|---|
| **Technical champion** — CIO/CTO, head of data/AI, enterprise architect | "I need to show my risk team this isn't another chatbot that will leak data." | "It enforces permissions at retrieval, records every step, runs inside our VPC or air-gapped — and here is the docs page that proves it." | Home → Platform page for their pain → Pricing → Contact |
| **Veto reviewer** — CISO, compliance, accreditation, GC | "Prove the governance is real and the audit trail is defensible." | "Evidence-locked facts, bitemporal history, approval gates, budgets with hard ceilings, tenant-scoped everything, SDK as the only capability surface." | Platform deep-dives, `/docs/governance`, `/docs/deployment`, LACE-GOV/Finance/Legal |
| **Builder** — senior engineer / domain expert who will ship | "Can I build an app without asking platform for a meeting every time?" | "Manifest declares it, `lace-app-sdk` provides it, publish runs the same audited lifecycle as generated apps, rollback is one click." | App Builder, `/docs/install`, `/docs/quickstart`, `/docs/manifest` |
| **Mission / program lead** (Gov) | "The boundary is not negotiable." | "Runs fully disconnected, open-weight models locally, BFO/CCO-conformant packs, cross-enclave federation without data movement, exportable evidence pack." | LACE-GOV → Pricing Gov tier → Contact with "Air-gapped" in the form |

**Every path ends at `/contact`.** There is no self-serve signup to optimize. The form is the product's "checkout." Keep it that way; it signals enterprise.

---

## 6. Voice, guardrails, and what we will not say

Stolen from `PRODUCT.md` and `DESIGN.md` and kept honest:

- **Plain, specific, unhyped.** Name exactly what the system does and does not do. "Permissions enforced at query time" beats "enterprise-grade security."
- **One accent green, earned.** Green marks *verified* — a checked fact, a matched citation, a surveyed junction. It never marks a CTA because you want clicks.
- **No emoji in shipped copy.**
- **Governance is the product, not the footnote.** Every offering page shows the control — permission, provenance, gate, audit — as part of how the thing works.
- **Survive the second reader.** Write for a champion who will forward it to a hostile reviewer. Prefer a mechanism over a superlative. If you cannot name what was checked, use ink.
- **No fabricated proof.** No logos, testimonials, benchmark numbers, customer counts, or ROI claims. Credibility comes from the product surface, not borrowed social proof.
- **Deterministic stays pipeline-layer.** Do not say "the knowledge graph is deterministic" — say it is evidence-locked, bitemporal, governed. Determinism belongs to the pipeline/orchestration layer.
- **BFO/CCO stays vertical-relevant.** It belongs on Knowledge Graph, LACE-GOV, and docs — not as a global headline.
- **No "AI employees" without the governance sentence in the same breath.** Every mention of an agent that acts must be followed by its gate.

---

## 7. Master positioning & tagline bank

### The one-line position (pick one to pin above the fold everywhere)

> **The governed AI platform for organizations that cannot deploy an ungoverned one.**

Alternatives, ranked, for seasonal or campaign use:

1. **Governance is in the runtime, not the prompt.** *(sharpest — names the wedge in seven words)*
2. **One platform. Every deployment boundary you actually have.**
3. **Answers with receipts. Agents with guardrails. Applications that ship.**
4. **Your knowledge, turned into software you can defend.**

### Hero taglines by audience

| Audience | Tagline | Subhead (when space allows) |
|---|---|---|
| **CIO / enterprise buyer** | Your knowledge, ready to work. | Search, graph, agents, and apps on one governed substrate — running where you are allowed to. |
| **CISO / compliance** | Every answer cites its source. Every action needs a permission. | |
| **Builder** | One prompt. A versioned application. | You describe it; the builder plans, scaffolds, proofs, and publishes — you ship and bill. |
| **Gov / mission** | The internet is not required. | The same platform, fully disconnected — open-weight models, no external AI calls, evidence you can export. |

### Category naming (use consistently)

- **LACE** (always caps), product of **Determinant Systems**.
- **Offerings:** Enterprise Search, Knowledge Graph, Agent Studio, App Builder.
- **Verbs:** `provenance`, `permissions enforced at query time`, `evidence-locked`, `bitemporal`, `approval gates`, `budgets`, `audit trail`, `governed materialization`, `federation`.
- **Never:** "deterministic knowledge graph," "LFACE," "alpha," "coming soon," "trusted by."

### Taglines to retire (and why)

- "Enterprise AI. Governed." — keeps the design, but it has done its tour. It is now the eyebrow, not the headline. The headline must carry a mechanism.
- "Vibe coding for the enterprise" / "enterprise vibe coding" — keep it for the blog post title, not for the product surface. It signals unseriousness to the veto reader.
- Any headline that promises speed without the control sentence. Speed is the second sentence now.

---

## 8. Site-wide changes that touch every page

These are not page-specific copy tweaks; they are product-wide positioning edits to apply once and keep.

**A. Put the governance wedge above the fold on every path.**

Add a one-line "How LACE governs" ribbon above the first CTA band on every platform and applications page:

> **How LACE governs:** permissions checked when a fact is retrieved, not after a model reads it · budgets and approval gates enforced at execution · every output carries a pointer to its source · history is bitemporal and reviewable.

That ribbon is one sentence in DESIGN.md's Readout style. It survives the forward-to-security pass.

**B. Name the deployment boundary as a first-class choice.**

Every CTA band should offer the four footprints explicitly: *Managed cloud · Private cloud (VPC) · On-premises · Fully air-gapped.* Buyers self-identify by boundary before they self-identify by tier. The pricing comparison table already does this — echo it in the nav dropdown label and the contact form's `deployment` select (which already exists — make it visible higher on the form).

**C. Retire the fourth accent color on every surface except the conflict flag.**

Green = verified. Amber = contested/conflicted (with the dot, the count, and the resolution path). Red = denied/absent (with the ✕ glyph). There is no fourth marketing color. A docs callout that wants to feel "important" gets a label, not a hue.

**D. Make citations the through-line, not a bullet.**

Current pages list "citations" as one of six bullets. It should be the red thread: every graph fact, every search answer, every agent draft, every app data view carries a pointer that opens the passage, cell, or row it came from. Repeat that sentence — verbatim — on Search, Graph, and Agent Studio. Repetition across pages is the point; it teaches the platform shape.

**E. Add one line to every nav interaction: the SDK is the boundary.**

When a developer hovers Agent Studio or App Builder in the megamenu, the micro-copy already says `lace-app-sdk` — keep it, and add consistently: *the only surface that reaches identity, data, policy, limits, and audit.* That is the sentence that lets a reviewer approve the architecture without reading code.

**F. No plural of "AI" without a governor.**

"AIs," "AI agents," "agentic AI" can drift into anthropomorphic hype. Prefer: *agents that propose; deterministic services that enforce.* If the platform writes it, say which service wrote it.

---

## 9. Home — `/`

**Route:** `apps/lace/src/pages/index.astro` → `packages/site-kit/src/components/lace/LaceHomePage.astro`
**Current title:** `Enterprise AI Platform for Governed Search & Agents | LACE`
**Current hero:** *Enterprise AI. Governed.* + "LACE turns your company's knowledge into trusted answers, governed agents, automated workflows, and production-ready applications."

New copy preserves the governed-line design — the sticky pinned headline, the rising screenshot, the `+` crosshairs, the fragment windows — and replaces the words with a mechanism-first version that wins the forward-to-security pass.

### Eyebrow + hero

```
Eyebrow:  The AI platform for the governed enterprise
H1:       Your knowledge, ready to work.
          — governed by the platform, not the prompt.
Subhead:  One substrate. Four outputs. Search that cites its source. A graph
          where every fact carries a receipt. Agents that need a permission and
          a gate before they act. Applications you describe in a sentence and
          ship as versioned software. Running where you are allowed to — managed
          cloud, private VPC, your data center, or fully air-gapped.

Primary CTA:  Book a demo          (→ /contact)
Secondary CTA: Platform overview (PDF)  (→ LACE-Platform-Overview.pdf, opens in new tab)
```

> **Why this hero:** The champion can now forward the subhead to a reviewer and the reviewer sees, in one paragraph, the permission model, the provenance model, the agentic guardrails, the app lifecycle, and the deployment boundary. That is the whole sale's one-paragraph brief.

### Editorial statement

Current: "Put everything you know to work..." (strong — tighten, add the enforcement line).

```
Put everything you already know to work.
Find any answer. Catch the contradiction two documents made. Put a real
agent on a real channel. Ship the tool the team keeps asking for.
All on one platform — with the permissions, evidence, budgets, gates,
and audit built in, not bolted on.
```

*The green phrase is now "built in, not bolted on" rather than "Automate real work" — it names the wedge.*

### Platform map (six in → one governed line → four out)

Keep the diagram. Replace the heading above it:

```
Heading:  One governed line.
Caption:  Six source families in. One governed line through. Four ways out —
          each output citing the source it came from.  [Diagram already carries the labels.]
```

### Cells

Keep the 2+2+full+ governance structure. New copy for each, optimized for scannability (2–3 sentences, then the fragment does the arguing).

#### Cell 01 — Enterprise Search (full-width)

```
Kicker:   01  Enterprise Search
H2:       One question. Every system. The exact source.
Body:     Ask in plain language across SharePoint, Drive, OneDrive, Dropbox,
          Notion, Slack, Teams, email, S3, databases, and your existing indexes.
          LACE returns a composed answer where every material claim cites the
          exact passage, table cell, or row it came from — and permissions are
          enforced at retrieval, so no one sees a result they cannot open at
          the source.
Demo:     LaceSearchDemo — keep, but change the sample query to one that
          foregrounds the citation mechanic: e.g.,
          "What did we commit to on renewals in the Meridian MSA — and which
          version governs?"  with the answer's citations opening to §4.2 and
          Table 3.
Link:     Enterprise Search →
```

#### Cell 02a — Knowledge Graph: the living map

```
Kicker:   02  Knowledge Graph
H2:       Your entire business — one living map.
Body:     LACE reads the documents you already have and maps what the company
          actually knows: customers, contracts, obligations, dates, amounts.
          Ask what you owe, what expires, what changed — get the answer with the
          source attached and the time it was true.

Fragment: Keep lore-kg-dark screenshot (already strong — "a living map").
Link:     Knowledge Graph →
```

#### Cell 02b — Knowledge Graph: conflict detection

```
Kicker:   02  Knowledge Graph
H2:       It catches what everyone missed.
Body:     When two documents disagree on a fee, a date, an obligation — LACE
          surfaces the conflict with both passages side by side and routes it
          to counsel for a ruling. The graph remembers the decision.

Fragment: Keep conflict review window verbatim — strongest product moment on
          the site. Change only the document IDs to feel current if needed
          (MSA-2024 §7.1 vs. Summary deck p.4 is good; it is specific).

          Keep the amber flag language as policy:
          "1 conflict open · routed to counsel@ for ruling" — never drop the
          resolution path.

Link:     Conflict detection →
```

#### Cell 03a — Agent Studio: job description in, teammate out

```
Kicker:   03  Agent Studio
H2:       Job description in. Teammate out.
Body:     Describe the role — renewals watchdog, intake clerk, research analyst.
          LACE builds the agent with you, proves it against test scenarios, and
          puts it to work inside your permissions, on a budget, with the risky
          step held for a human.

Fragment: Keep the contracts-intake trace. Add one micro-copy edit — the
          "Approval required · Send reply to vendor · Approve" gate should
          carry the rule that makes it real:
          "Approval required · Send reply to vendor · one approval · 15-minute
          window"  (mirrors how the gate actually works: approver, count,
          timeout).
Link:     Agent Studio →
```

#### Cell 03b — Agent Studio: every channel

```
Kicker:   03  Agent Studio
H2:       Everywhere your customers already are.
Body:     One agent, every channel — web chat, Slack, Teams, email, SMS,
          WhatsApp, live voice. Answers come from your verified knowledge, and
          the agent hands off to a person the moment it should — transcript and
          sources attached. No messaging infrastructure project required.

Fragment: Keep channel grid intact. Add the API chip verbatim — it matters to
          buyers who think "channels" means "only chat."
Link:     Deployment channels →
```

#### Connector strip (marquee)

No copy change. Add `aria-label="Connectors: SharePoint, Google Drive, OneDrive, Slack, Teams, Notion, Dropbox, Gmail, Amazon S3, Salesforce, PostgreSQL — and your existing indexes"` for screen readers (currently `aria-hidden` on the whole strip).

#### Cell 04 — App Builder: prompt → production

```
Kicker:   04  App Builder
H2:       In your own words.
Body:     The tool the team keeps wishing for — describe it in a sentence, get
          back a live application at a real URL in minutes. Pages, portals, and
          full applications with sign-in, a database, releases, and one-click
          rollback. The builder plans it, scaffolds it in an isolated sandbox,
          proofs it through real lanes, and only then publishes a versioned
          release.

Diagram:  Keep the three-node flow (Agent → Git → Cloud container over
          @platform/sdk). Add one caption under the SDK band:
          "No raw database handle. No secret bypass. The SDK is the only path
          to data, identity, policy, and audit."

Link:     App Builder →
```

#### Cell 04b — App Builder: launch a business

```
Kicker:   04  App Builder · Launch
H2:       Your idea. Live. Selling.
Body:     Build the product and the business around it. Subscriptions and
          billing are built in, hosting scales, and LACE handles the launch
          checklist — domain, certificates, entity — down to the payout.

          Keep the billing window. Change "Example" tag to "Example — flowlane.app"
          and keep the sparkline (MRR moment is strong sampling).

Link:     Launch on LACE →
```

#### Governance band

Current: strong but vague ("Deterministic in nature. Policy-driven.") — sharpen with the four mechanisms and make them scannable.

```
Heading:  AI your risk team will sign off on.
Body:     Deterministic where it counts. Permissions checked at retrieval, not
          after a model reads. Budgets with hard ceilings. Approval gates that
          pause execution until a person decides. Every step recorded.

Chips:    Provenance · Permissions · Budgets · Approvals · Audit · Bitemporal
          (keep vs. replace)
```

#### Built on LACE (three editions)

```
Heading:  Built on LACE.
Subhead:  Industry-specific products we ship — on the same platform we sell.
          Start with the platform, or start with the product.

Cards — copy tightened for one-line scannability:

  LACE-GOV   · Federal · Defense · Intelligence
             Standards-conformant knowledge for the mission boundary.
             → Explore LACE-GOV

  LACE Legal · Legal · Compliance
             Contract intelligence with the receipts attached.
             → Explore LACE Legal

  LACE Finance · Financial Services
             Research where every figure traces to source.
             → Explore LACE Finance
```

#### Deploy rings

```
Heading:  Deploy it your way.
Body:     One platform, four ways to run it. Your data never has to leave home.
          The governance substrate — permissions, evidence, budgets, approvals,
          audit — is identical in every footprint.

Rings — keep labels. Change core label from "Your data" to "Governed substrate"
         with sublabel "same controls, any boundary" (makes the claim travel).

Chips:
  Cloud (Fastest start)
  Private Cloud (Your VPC)
  On-Premises (Your hardware)
  Air-Gapped (Zero external calls)
```

#### MCP section

Current LaceMcpSection is strong and appropriately technical. One copy edit:

```
Heading:  LACE where your team already works.
Subhead:  Expose search, graph, and agent capabilities over MCP so the coding
          agents and editors the team lives in — Cursor, VS Code, Claude Code —
          reach LACE through the same governed SDK.
```

#### Final CTA

```
H2:       See it on your documents.
Body:     We scope a pilot on your documents and one workflow your team
          actually runs — under NDA. You judge the output on your
          problem, with receipts, in weeks rather than quarters.

CTA:      Book a demo   ·   Platform overview (PDF)
Micro:    No sales-driven self-serve. Every conversation is a qualified
          evaluation — if we are not the fit, we will tell you.
```

---

## 10. Platform — Enterprise Search — `/platform/enterprise-search`

**Current hero:** "One search bar for everything your organization knows." — good, keep the shape, sharpen the subhead.
**Antagonist:** keyword-only search that misses paraphrase, and vector-only search that hallucinates numbers.
**The one line this page must land:** *Permissions enforced at retrieval, not after.*

### New copy

```
Kicker:   Platform · Enterprise Search
H1:       One question. Every system. With the source.
Accent:   every system
Lead:     LACE connects to the repositories where your knowledge already
          lives — SharePoint, Drive, OneDrive, Dropbox, Notion, Slack, Teams,
          email, S3, databases, websites — and keeps one continuously
          synchronized, permissions-aware view. Ask in plain language; get a
          direct answer where every material claim cites the exact passage,
          cell, or row it came from. Click a citation and the source opens,
          highlighted — no re-searching.

Demo CTA  [inside demo]:  Try a query like "renewal notice period for Meridian
          MSA — governing version?" and watch the citations.
```

**Capability grid (six points — rewritten for tighter scanning):**

| H3 | Body (current → proposed) |
|---|---|
| **Connect everything** | Current is good — add "...and your existing indexes — without asking a division to surrender its corpus to a central lake." (federation wedge) |
| **Answers, not links** | "Retrieves the most relevant passages and composes a direct answer — every answer is a bundle of cited passages, not a list of ten blue links with a model summary on top." |
| **Permissions-aware by design** *(rename to: Permissions at retrieval)* | "Access rules are enforced when the index is read, not after a model has read the paragraph. If a person cannot open the document at the source, the model never sees it to summarize." |
| **Search without moving data** | "Federated discovery lets divisions, enclaves, or partners answer queries from their own store, under their own policy — only permitted results cross, and every crossing is logged." |
| **Meaning and keywords — at once** *(rename)* | "Hybrid retrieval runs a meaning-based (vector) leg and an exact (lexical) leg in parallel and merges them with reciprocal-rank fusion. Paraphrase and part number both win." |
| **Always current** | "Scheduled sync + change reconciliation — edits update in place, deletes propagate, moved documents keep their identity, permission changes carry forward so citations remain durable." |

**In practice (replace current generic vignette — sharper, with names):**

> A program manager asks: "What did we commit to on the Meridian renewal — and was risk flagged?" LACE pulls the signed contract from SharePoint (§4.2), the risk thread from Slack, and the status memo from Drive — one composed answer, three citations that open the passage they came from. Seconds, not an afternoon of hunting.

**Deep dive — three columns (current headings are right — tighten bodies):**

```
01  Two searches in one
    Lexical for the exact identifier — clause reference, part number, ticket ID.
    Vector for the paraphrase — "give me everything about the delay." Reciprocal-
    rank fusion returns one list ranked by both, so you never choose which failure
    mode to live with.

02  Permissions checked on every search
    Source identities and ACL snapshots flow forward from the connector, so the
    filter is applied to the rows before they are ranked, fused, or shown. A
    restricted document cannot leak through a summary because it was never a
    candidate.

03  Citations that open the page
    Evidence carries stable document / block / span identity. A figure comes from
    its actual table cell — row, column, unit, period — not from a flattened
    paragraph a model re-read.
```

**CTA:**

```
Title:  Ask your own documents.
Lead:   Scope a one-workflow evaluation on your corpus. You bring the corpus;
        we bring the connector. You judge the citations.
```

**FAQ — tighten answers (keep questions):**

- Q "Which channels can LACE agents use?" → answer already on Agent Studio; cross-link, do not duplicate here.
- Add: **Q "What is hybrid retrieval, and why do I care?"** → A: see row 01 above, verbatim.

---

## 11. Platform — Knowledge Graph — `/platform/knowledge-graph`

**Current hero:** "Your documents, turned into a network of facts." — keep (strong). Sharpen lead to include bitemporal in the first paragraph.
**Antagonist:** a vector store that "feels" like a graph, and a graph that has no evidence.
**The one line this page must land:** *Every fact on the map carries a receipt — and a clock.*

### New copy

```
Kicker:   Platform · Knowledge Graph
H1:       Your documents, turned into a network of facts.
Accent:   a network of facts.
Lead:     Search finds documents. The Knowledge Graph understands what is
          inside them — people, organizations, contracts, obligations — and how
          they connect. It is built to a standard most graph products never
          attempt: every fact carries a receipt (the passage it came from) and a
          clock (when it was true and when you learned it).
```

**Six points:**

| H3 | Body |
|---|---|
| **Every fact has a receipt** *(keep)* | "Click an entity, relationship, or value and see the highlighted sentence, the document version, and the approver — provenance you can show an auditor, not a footnote you hope they don't check." |
| **Proposed by AI, accepted by humans** *(rename from Automatic extraction)* | "AI proposes candidates with pointers to the spans they came from. Your reviewers accept, reject, or correct. Low-confidence or conflicting work never silently enters the graph — it queues for review." |
| **One entity, complete — and reversible** *(rename)* | "“Acme Corp,” “ACME Inc.,” and “Acme Corporation” become one audited view. And if that merge was wrong — two people, one name — you undo it rather than reconstruct by hand." |
| **Travel through time** *(keep)* | "Bitemporal: valid time (when the fact held in the world) and transaction time (when LACE believed it). Scrub to March 12 and see the business as you knew it then — restatements add a new value without erasing the old." |
| **Contradictions surface themselves** *(keep)* | "When two sources disagree on an amount, a date, an obligation — flagged, side by side, with both citations. Conflict detection is not a report you request; it is a property of the graph." |
| **Built for federal standards** *(keep — scope to programs that need it)* | "Versioned schema packs aligned to the Basic Formal Ontology and Common Core Ontologies — the semantic standards federal programs increasingly mandate. Packs ship as executable contracts, checked continuously." |

**In practice:**

> Drop two versions of a policy into LACE and get an instant conflict map: every changed obligation, amount, and date — each with both passages side by side. Scrub the timeline back and watch the enterprise evolve, point-in-time.

**Deep dive:**

```
01  Bitemporal assertions
    Facts record when they were true and when LACE believed them. Corrections
    close and supersede assertions — history is never rewritten. That is what
    makes "what did we know, when?" answerable years later.

02  Schema packs — executable contracts
    A versioned pack defines the classes, relations, identity rules, and
    validation the graph will accept. Drafts are editable; publishing is
    governed and immutable. Change the pack and the write gate enforces it.

03  Governed materialization
    Candidates → validation → grounding → review → graph. Low-confidence or
    conflicting work queues for humans. High-confidence work with full evidence
    can auto-materialize. The gate is the boundary; the model never sets it.
```

**CTA:**

```
Title:  See your documents become a graph.
Body:   Bring one governing document family — contracts, policies, filings —
        and watch the graph propose its first map. You approve what enters.
```

---

## 12. Platform — Agent Studio — `/platform/agents`

**Current hero:** "Build AI agents for your operational workflows." — generic; misses the channel wedge. Replace.
**Antagonist:** a tool-calling loop with no gates, no budget, no channel infrastructure.
**The one line this page must land:** *The agent proposes; the platform decides whether it may act.*

### New copy

```
Kicker:   Platform · Agent Studio
H1:       The teammate that asks permission.
Accent:   asks permission.
Lead:     Agent Studio is where you describe the role — renewals watchdog,
          intake clerk, research analyst — and ship a teammate that works
          inside your permissions, on a budget, with the risky step held for
          a human. One agent, every channel you already live in — web chat,
          Slack, Teams, email, SMS, WhatsApp, live voice — with handoff,
          consent, retries, and cost attribution built in per channel.

Body engineering detail (below lead):
    Built on one control plane: in-process loop tool calling with checkpointed
    progress plus an external-harness cell for bounded work. Every run is
    recorded step by step; a crash resumes from the last completed step rather
    than starting over.
```

**Six points:**

| H3 | Body |
|---|---|
| **Build with AI — prove before you promote** *(rename)* | "Describe the role; iterate on a live preview. Built-in evaluation suites score the agent on representative and adversarial scenarios — and production monitoring watches quality, latency, cost, and behavior after you ship." |
| **One agent, many surfaces** *(rename from Deploy across every channel)* | "Deploy the same agent to web chat, Slack, Teams, email, SMS, WhatsApp, and live voice. Channel surfaces normalize consent, delivery failures, escalation to a person, media, and usage/cost per conversation — you don't build messaging infrastructure to go live." |
| **Grounded in your verified knowledge** *(keep angle, sharpen)* | "Agents draw on Enterprise Search and the Knowledge Graph — answers are composed from cited passages and slot-fill from evidence-locked facts, not from a model's paraphrase of your corpus." |
| **Governed, not just capable — hard ceilings** *(sharpen)* | "Budget caps are enforced at dispatch: an agent that would exceed its ceiling stops and escalates rather than continuing and billing. Allowed-action lists and approval gates are re-checked on every step — revoke mid-run and the next dispatch honors it." |
| **Watch it think** *(keep — strongest human moment)* | "Step-by-step traces — which tools, which retrieval, which approval, and why. The trace is the audit trail; the audit trail is the trace." |
| **Capable only of what you listed** *(rename from Permissions you can read)* | "Each agent carries an explicit list of capabilities — which tools, knowledge, pipelines, and delegation it may use. That list is declaration, not prompt: it cannot be talked around, and changing it re-opens review." |

**In practice:**

> A contracts intake agent receives a vendor question by email, checks the governing agreement through Enterprise Search, drafts a reply citing the exact clause, and routes it to counsel for single-click approval — the entire chain of evidence preserved, attributed, and exportable.

**Deep dive:**

```
01  Runs that finish — even after failure
    Every step is checkpointed as it completes. Crash, timeout, restart — the
    next run resumes from the last completed step with idempotency keys and
    dead-letter handling, rather than duplicating work or disappearing.

02  Permissions you can read — and revoke mid-run
    Capabilities are explicit references, not prompt hopes. Change the agent and
    it re-enters review; revoke a tool mid-run and the agent finds it
    unavailable on the next dispatch — not "discouraged."

03  Ready for the real channel — not just the demo channel
    Putting an agent on email or voice means consent, delivery retries, human
    handoff with the transcript intact, and knowing what each conversation cost.
    That is not a wrapper you bolt on; it is the channel plane LACE already runs.
```

**CTA:**

```
Title:  Put your first agent to work.
Body:   Describe the role, prove it on your workflow, deploy it on your
        channel — with the gate you choose.
```

---

## 13. Platform — App Builder — `/platform/app-builder`

**Current hero:** "From one prompt to a live application — in minutes." — keep shape, add the control sentence immediately.
**Antagonist:** a generated app that is a demo with no lifecycle, and a "real" app that takes a quarter.
**The one line this page must land:** *Generated code that ships like product — because it goes through the same audited lifecycle as hand-written code.*

### New copy

```
Kicker:   Platform · App Builder
H1:       One prompt to a live application.
          — then a lifecycle that makes it real.
Accent:   a live application
Lead:     Most great software ideas die in the backlog. App Builder removes
          the bottleneck in the right way: describe the application you want,
          LACE plans it, builds it in an isolated sandbox, proofs it through
          real lanes, publishes a versioned release at a real URL, and keeps
          handling sign-in, database, releases, and one-click rollback for you.
          Hosting, database, and billing are included — not a second project.
```

> *This is where you kill "vibe coding." The word "lifecycle" does the killing.*

**Six points (tightened):**

| H3 | Body |
|---|---|
| **One prompt to production — with a gate** *(sharpen)* | "An AI builder plans the app, constructs it in a sandbox, shows a live preview, and publishes to a public URL. The same path hand-written apps take: intent → architect → scaffold → validate → proof lanes → seal → publish. There is no faster, less-governed lane for generated code." |
| **Real applications, not demos** *(keep)* | "Secure authentication, role-mapped permissions, typed data with an auto-generated admin panel, versioned releases, gradual rollouts, one-click rollback. What you ship is not a prototype you then need to rebuild." |
| **Every app can talk** *(rename to: Every app ships with an assistant)* | "Applications come with a built-in AI assistant wired to the app's own data and tools — every product you launch is an AI product without retrofitting a chat surface." |
| **Monetize from day one** *(keep — but add the unit economics)* | "Launch, price, and sell on the same platform: subscription plans, checkout, invoicing, metered usage, your domain with automatic certificates. Hosting scales with the app — near-zero marginal cost per new app." |
| **Remix and compound** *(rename)* | "See an app you like? Remix it into your own editable copy in seconds. Templates compound — the hundredth app is dramatically faster than the first because it extends a proven manifest." |
| **A professional lane for developers** *(keep — add editor names explicitly)* | "A Git repository seeded with a working app and the SDK wired in. Open it in Claude Code, Codex, Cursor, VS Code, JetBrains — anything that opens Git. Commit and LACE builds, proofs, and publishes a versioned release you can roll back." |

**In practice:**

> Keep current vignette verbatim — it is the leanest credibility moment on the site: "I described an inventory tracker in the Studio. Fifteen minutes later I opened a live URL, added our first records, and sent the link to my team." That is the acceptance bar the builder is tested against.

**Deep dive (three columns — add the sentence that wins the security review):**

```
01  An audited lifecycle — the same for generated and hand-written
    Intent → architect session → scaffold/workspace → validate → proof lanes →
    seal/package → registry → activate/publish. Every stage recorded. Every
    release versioned. There is no "generated" discount on rigor.

02  Isolated sidecars — blast radius per app
    Published apps run as their own sidecar runtime. Core never imports app
    code; apps never bypass tenant or policy checks. Tenancy is enforced by
    the platform on every data call, not by discipline in app code.

03  The public SDK — governed by construction
    Generated and hand-written apps target the same lace-app-sdk contracts — so
    tenancy, policy, data governance, and audit come free. Breaking a published
    SDK symbol is a major version with a deprecation window, not a surprise.
```

**FAQ — keep all six, add precision to one:**

- Q "Can I sell subscriptions..." → add "...without a re-platforming?" and answer keeps current + "at near-zero marginal cost per new app."
- Q "Can I build a LACE application in my own editor..." → answer already strong; add product link to `/docs/install` inline.

**CTA:**

```
Title:  Describe the tool. Open the URL.
Body:   You describe it; LACE builds it safely, hosts it, and versions it.
        You own the Git history and the next iteration.
```

---

## 14. Applications hub — `/applications`

**Current hero:** "Software we ship. On the platform we sell." — this is the single best line on the entire site. Keep it. The supporting copy needs one edit: tell the buyer *when* to start with the platform vs. when to start with the product.

### New copy

```
Eyebrow:   Applications
H1:        Software we ship.
           On the platform we sell.
Accent:    (none — let the line breathe as a statement)
Lead:      LACE-built, LACE-managed applications offered as products in
           their own right — for the industries where auditability is the
           purchasing decision. Buy the edition, or buy the platform and
           build your own. Same substrate, same governance, same evidence.

Three edition cards — keep structure, tighten body to one sentence of
jobs-to-be-done each:

  LACE-GOV  · Federal · Defense · Intelligence
            For programs where the internet is not allowed and the ontology
            is not negotiable. Air-gapped, BFO/CCO-conformant, cross-enclave
            federation, evidence you can export to an ATO package.

  LACE Legal · Legal · Compliance
            For teams that track obligations across versions and need to
            answer, years later, what the organization knew and when.

  LACE Finance · Financial Services
            For research and reporting where every figure must trace to the
            table cell, filing, period, and unit it came from.

Portfolio section (Built on LACE):

  Keep three portfolio apps (Proposal Studio, Compliance Desk, Intake Triage)
  and the "Launch your own" callout. Change subhead to:

            Every app inherits the governed substrate — including yours.
            The App Builder + lace-app-sdk lane makes your hundredth app
            deliberately faster than your first.

  CTA inline:  App Builder  ·  lace-app-sdk (→ /docs/install)

Footer band: keep band but change line:
  "Buy the platform. Or just the product. The editions and the portfolio
   apps run on the same governed foundation — start wherever the pain is."
  → change "pain" to "constraint" (less consultant-ese):
    "— start wherever the constraint is tightest."
```

---

## 15. LACE-GOV — `/applications/lace-gov`

**Current hero:** "Standards-conformant AI for the mission boundary." — excellent. The rest of the page is the strongest vertical piece; edits are precision, not reframe. The veto reader here is an authorizing official — every sentence must read as something they could cite.

### New copy

```
Kicker:   Applications · LACE-GOV
H1:       Standards-conformant AI for the mission boundary.
Accent:   for the mission boundary.
Lead:     (Keep current — add one sentence of who it is for)
          LACE-GOV is the platform packaged for federal, defense, and
          intelligence programs where the assessment starts with "where
          does it run?" BFO/CCO-conformant schema packs, cross-enclave
          federated discovery without data movement, fully air-gapped
          deployment with no external model calls, and accreditation evidence
          — lineage, access enforcement, standards conformance — exportable
          as artifacts. Accreditation is program-specific; the platform
          supplies the enforcement and the evidence, and the AO retains the
          boundary. [Retain this last sentence verbatim — it is essential to
          avoid overclaiming on FedRAMP/IL/ATO.]

Six points — tighten only the weakest:

  Air-gapped AI deployment
    → Add: "Model and platform updates are applied from media you control.
       There is no component whose liveness depends on an outbound connection."

  Accreditation evidence as an export
    → Change to: "Lineage, access enforcement logs, agent execution traces,
       and conformance checks come out as artifacts — not a reconstruction
       assembled after the assessor arrived."

  (Keep the other four points verbatim — they are already AO-grade.)
```

**Deep dive — one copy edit:**

```
01  No external AI calls, by construction
    (Keep verbatim — "not a configuration flag over a cloud product"
     is exactly the sentence that kills the skeptical reading.)

02  Provenance that survives audit
    (Keep verbatim — add cross-ref: "See Bitemporal assertions on
     the Knowledge Graph page for how valid/transaction time makes
     point-in-time queries the question investigations actually ask.")

03  Standards packs, not consulting engagements
    → Change "BFO/CCO alignment ships as versioned schema packs..." to
       "Conformance ships as versioned schema packs that upgrade with the
        platform. It is checked continuously rather than certified once by a
        services team."
```

**CTA:**

```
Title:  Bring governed AI inside the boundary.
Body:   Bring a standards-required use case and the enclave you need it to run in.
        We will scope inside that boundary — and hand you the evidence that it stayed there.
```

**FAQ addenda — add one question that currently forces the buyer to ask on a call:**

- **Q "What if we are not air-gapped yet but need to get there?"** → A "LACE-GOV runs as customer-operated software across the continuum — commercial cloud, government cloud, private cloud, on-premises, fully disconnected. Teams regularly start in managed cloud on a pilot corpus and harden toward the enclave boundary as the program's authorization progresses. The same manifest, subgraph, and policies travel with them."

---

## 16. LACE Legal — `/applications/lace-legal`

**Current hero:** "Contract intelligence with the receipts attached." — keep verbatim. It is the line a GC repeats in the hallway. One edit: make the deadline anxiety visceral, not abstract.

### New copy

```
Kicker:   Applications · LACE Legal
H1:       Contract intelligence with the receipts attached.
Accent:   with the receipts attached.
Lead:     LACE Legal watches the document record your lawyers already live in
          — executed agreements, amendments, side letters — and turns it into
          a defensible, time-travelable ledger of who owes what, what renews
          when, what notice a termination actually requires, and what two
          versions disagree on. Every extracted term links to the clause,
          document version, and page it came from. When someone asks "what did
          we know — and when?" — that is the query the graph answers natively.

Six points — minor retunes for scannability:

  Obligation tracking → "Structured obligations with owners and dates — not
    highlights in a PDF that expire the moment the document moves."

  Renewal and notice-period surveillance → "Auto-renewal dates and notice
    windows computed from the governing language, surfaced before the window
    closes — so evergreen terms do not renew by inattention."

  Version conflict detection → "When an amendment or side letter contradicts
    the base agreement, the conflict is flagged side by side rather than the
    later document silently winning."

  Clause-level citations → "Review means checking a citation, not re-reading
    the contract to see whether the model was right."

  Point-in-time queries → "Ask what an obligation looked like on a specific
    past date. Bitemporal separation of valid vs. transaction time — the
    distinction discovery and litigation holds turn on."

  Review workflows → "Extractions route to counsel for confirmation before
    they become relied-upon facts. Approvals, rejections, edits — all part of
    the record."
```

**Deep dive:**

Keep title "Built so the extraction is defensible." All three cards stay — tighten middle:

```
01  Evidence-locked, not summarized
    When the source document is superseded or corrected, dependent facts are
    flagged rather than left standing on a citation that no longer says what
    it did. Evidence is a Pointer, not a summary.
```

**CTA:**

```
Title:  Put the contract record on the record.  (keep — strong)
Body:   Bring the agreement family that worries you most. We will map it — with
        receipts — and show you the conflict the next renewal would have found
        too late.
```

---

## 17. LACE Finance — `/applications/lace-finance`

**Current hero:** "Research where every figure traces to source." — keep. Finance is the hardest vertical to win because the buyer already has a research stack. The page's wedge is not "better research" but "figures that cannot lie about their unit."

### New copy

```
Kicker:   Applications · LACE Finance
H1:       Research where every figure traces to source.
Accent:   traces to source.
Lead:     LACE Finance grounds research and reporting in filings, agreements,
          and internal data — with figures returned from the actual table cell
          they sit in, not from a model's paraphrase of the page. Analysis
          workflows stay auditable, agents operate under hard policy constraints,
          and every number keeps its unit, scale, currency, and period attached —
          so a comparison that would be silently wrong instead fails loudly.

Six points — one rename for precision:

  Table-native answers → add: "a figure without its unit, scale, currency,
    and reporting period is a liability. Numbers are stored with that context
    so thousands do not quietly become millions."

  Filing and report drafting → rename to "Grounded drafting across filings,
    memoranda, and internal reporting — each figure and assertion linked to the
    source and period it was drawn from."

  (Keep Auditable workflows, Policy-bound agents, Information-barrier
   enforcement, Cost attribution verbatim — they are lender-grade.)

Deep dive — tighten "Spend under a hard ceiling":

  03  Spend under a hard ceiling
      Budget caps are enforced by the platform at execution, not advised in a
      dashboard afterward. An agent that would exceed its ceiling stops and
      escalates — the cost conversation happens before the invoice.
```

**CTA:**

```
Title:  Make every figure traceable.  (keep — best of three vertical CTAs)
Body:   Bring a filing, an earnings memo, and the question that should be
        easy but never is. We will trace it to the cell — including the one
        that proves it was restated.
```

---

## 18. Pricing — `/pricing`

**Current page is packaging-correct but positioning-timid.** It shows three tiers and a comparison table — all correct — but does not tell a buyer which one they are. That indecision costs you a qualification round.

### New copy

```
Kicker:   Pricing
H1:       One platform. Priced by footprint.
Accent:   Priced by footprint.
Lead:     Every tier includes all four offerings on one contract — Enterprise
          Search, Knowledge Graph, Agent Studio, App Builder — with the same
          governed substrate underneath: provenance, permissions enforced at
          retrieval, audit trail, budgets and approval gates, evaluation and
          monitoring. You choose where it runs and how far it reaches — we
          scope the rest with you.
          There is no public rate card. Every conversation scopes to your
          corpus, workflow, and boundary.

Three tiers — rewritten with a human + a boundary, not just a feature list:

  Cloud · The full platform, managed by us.
  For: teams that want search, graph, agents, and apps running on their
       data — without running infrastructure.
  You get: All four offerings on one subscription · Managed hosting,
           upgrades, and scaling · Standard connector library with
           scheduled sync · Usage-based AI budgets with hard caps ·
           Guided onboarding on your first corpus.
  CTA: Talk to sales  (→ /contact)

  Enterprise · Your cloud or your data center.     ← Most deployed
  For: regulated enterprises that need the platform inside their own boundary.
  You get: Everything in Cloud · Private cloud (VPC) or on-premises
           deployment · SSO/OIDC and role-mapped permission scopes ·
           Bring-your-own models and model policy controls · Custom
           connectors and federation across enclaves · Priority support
           and implementation services.
  CTA: Book a demo  (→ /contact)

  Government & Defense · Air-gapped. Accreditation-ready.
  For: federal, defense, and intelligence programs where the deployment
       boundary is the mission boundary.
  You get: Everything in Enterprise · Fully air-gapped deployment — no
           external AI calls · BFO/CCO conformance artifacts · Accreditation
           evidence pack: lineage, access enforcement, audit · Cross-enclave
           discovery without data movement · High-touch delivery by a team
           with DoD/USAF pedigree.
  Caveat to keep for now: Do not extend, repeat on new surfaces, or anchor a
  proof section on "DoD/USAF pedigree" or "BFO/CCO conformance artifacts"
  beyond what is already on this page — treat as unverified until confirmed as
  publicly claimable. (From PRODUCT.md — this is guidance for the writer, not
  copy.)
  CTA: Contact us  (→ /contact)

  Included in every tier (keep six chips verbatim — they are the deal's fine print made legible):
  Provenance on every output · Permissions enforced at query time · Complete
  audit trail · Budgets & approval gates · App Builder + lace-app-sdk ·
  Evaluation & monitoring

Comparison table — keep structure; two label edits for plainness:

  Row: "Bring-your-own models & model policy" → "Bring-your-own models & routing policy"
  Row: "Accreditation evidence pack" → "Accreditation evidence pack (lineage, enforcement log, audit)"
  Footnote under table (new, small): "Model policy, SSO/OIDC wiring, and custom
  connectors may be configured as optional on lower tiers during evaluation —
  table shows packaging, not a technical constraint."

Monetize band — keep strong section. Tighten head:

  Current: "Build it on LACE. Sell it on LACE." — keep.
  Body: Add second sentence that kills the "platform tax" objection:
        "LACE takes no per-seat tax on apps you sell — you set the plan,
         we run the hosting and billing infrastructure the apps already rely on."

FAQ — keep six questions, tighten three answers:

  Q "How is LACE licensed?" → Lead with "one contract, all four offerings —
    priced by scope and usage" and add "See the table above — if a row says
    'optional' we can shape it inside your footprint."

  Q "Does LACE replace existing systems?" → keep cross-ref to connectors;
    add federation line: "Federated discovery reaches what cannot move."

CTA band — keep:

  "Scope your footprint in one call.
   Tell us your deployment boundary, your corpus, and the first workflow.
   We'll come back with a concrete evaluation plan and pricing."
```

---

## 19. Contact — `/contact`

**Current page is the strongest conversion surface on the site — keep the layout (two-column, form on right), the direct phone/email, and the reassurance copy.** The edits are about qualification and lowering the psychological cost of filling it in.

### New copy

```
Kicker:   Contact
H1:       See it run
          with your context.
Accent:   with your context. (keep)
Lead:     Tell us the corpus, the workflow, and where it needs to run.
          We'll scope a sandboxed evaluation with you — on your documents,
          under NDA — and tell you plainly if we are not the right fit.

Direct:

  +1 (727) 282-4564
  info@laceplatform.com

Reassurance bullets — tighten to remove consultant-ese:

  • Technical evaluations under NDA — on your documents
  • Managed cloud, private VPC, on-premises, or fully air-gapped
  • Scope to pilot in days, judge in weeks — never quarters
  • You judge cited answers and working output, not slides

Form — labels are correct. Three edits:

  Label "What should LACE run?" → "What should LACE run on — and what must it respect?"
  Placeholder: "Five years of vendor contracts in SharePoint. Flagged renewal
    risks scattered across Slack threads. Must run in our VPC; GC wants clause-
    level citations for litigation holds."

  Label "Deployment preference" → "Where does it need to run?"
  Keep options: Not sure yet · Managed cloud · Private cloud (VPC) ·
               On-premises / air-gapped
  Add helper text under select: "Where it runs drives packaging. You can move
    along the continuum — starting in managed cloud and hardening toward the
    enclave is routine."

  CTA button: "Request an evaluation" → "Scope an evaluation"
               (softer commitment — scoping is the deliverable, not the sale)

Footnote — keep "Expect a reply within one business day — and we can sign
          an NDA before you share anything" verbatim. Move the FormSubmit
          detail to a comment in the Astro file, not into visible copy.
```

**Success — `/contact/success`:**

Current: minimal confirmation. Add a next-step line so the submitter knows what happens after the form — and to prevent a second submission from anxiety:

```
H1:     Evaluation request received.
Body:   We have your scope. Expect a reply by email within one business day —
        usually sooner. If you included a deployment boundary, we will come
        back with a same-boundary evaluation sketch — including what corpus
        connector we would start with.

        Need to add something? Reply to the confirmation email — it threads.

CTA:    Platform overview (PDF)   ·   Back to home
```

---

## 20. Docs hub — `/docs` (+ each doc page)

**The docs hub's job is not to sell. It is to make a builder believe, within 30 seconds, that the thing the marketing pages promise has an API with the same names on it.** Current docs do this well (typed code blocks, `lace-app-sdk` facade guarantee). Edits are mostly in bridging and consistency.

### Hub — `/docs`

```
H1:       LACE Platform and App SDK Documentation
Subhead:  Keep current paragraph + add one bridge sentence:
          The marketing pages promise search, graph, agents, and apps on one
          governed substrate. These are the contracts that substrate enforces.

Callout:  Keep "Full platform documentation is delivered in-product" — add:
          "The lace-app-sdk below is the public, stable surface. It re-exports
           live platform contracts — never a fork of them."

Start-here paragraph — keep, but reverse the order (builder first, evaluator second):
          "Building? Go straight to installing the SDK and the quickstart.
           Evaluating? How LACE is organized and deployment options are the
           shortest path to the shape of the system."

The four platform cards — keep titles, tighten lines:

  Enterprise Search  — Cited, permissions-aware answers across every source.
  Knowledge Graph    — Bitemporal facts with receipts and conflict detection.
  Agent Studio       — Agents bound by capabilities, budgets, and gates — on every channel.
  App Builder        — Prompt → sandboxed build → versioned, governed application.
```

### Thirteen doc pages — one-line bridge + hero edit per page

Each page keeps its code blocks verbatim except `workflows` (see below). The H1 + subhead pair is the only broad edit — making each doc page explicitly the implementation of a promise the platform pages made.

| Page | Current H1 | Proposed bridge (added under the subhead) | Notes |
|---|---|---|---|
| `/docs/organization` | How LACE is organized | The picture behind every marketing headline. | Add the five peer surfaces by name in a small table: Pipelines · Agents · Apps · Knowledge · Assistant — with "Peers, not layers — an agent can call a pipeline and a pipeline can write to the graph." |
| `/docs/deployment` | Deployment options | The boundary choices behind every "where it runs" claim on the marketing site. | Keep footprints table. Add one sentence under Air-gapped: "This is what makes the LACE-GOV air-gapped claim constructable rather than configurable." |
| `/docs/install` | Install the lace-app-sdk | The public, versioned boundary — what you import is what the platform enforces. | Keep façade-not-fork guarantee. Add link to `https://pypi.org/project/lace-app-sdk` (verify before shipping). |
| `/docs/quickstart` | Quickstart | Four files to a governed application — manifest, data, tools, agents. | Keep "The four files" list. Add timebox: "Working, governed, publishable in an afternoon." |
| `/docs/manifest` | Manifest | The one declaration that determines blast radius — and the diff your review actually reads. | Emphasize "declaration is enforcement" with an explicit "If it is not in the manifest, it does not run." |
| `/docs/data-collections` | Data collections | Typed, tenant-scoped data that comes with its own admin panel. | Keep. Add: "Apps never hold a DB handle — every read/write goes through `AppDataService`." (already there — elevate to the subhead.) |
| `/docs/tools` | Tools | Typed extension points with per-dispatch policy checks. | Keep constrained-runtime line. Add: "An approval revoked mid-run revokes on the next dispatch." |
| `/docs/agents` | Agents & skills | A capability list — not a prompt — is what bounds the agent. | Keep capability-enforcement sentence. Add under Skills: "Skills are shared `AgentSkill` behaviors inside a definition, not re-prompted boilerplate." |
| `/docs/agents-channels` | Agents & channels | One control plane. Every channel you already live in. | Keep control-plane frame. Add per-channel specifics: consent, retries, handoff, cost — the table the buyer uses to compare against DIY messaging infra. |
| `/docs/modules` | Module reference | Every module behind `lace-app-sdk` — and what each gives you. | Keep table. No copy change — this is the reference. |
| `/docs/datasets` | Datasets & connectors | Tenant-scoped containers over uploads and live connectors. | Keep permission-snapshot line. Add one sentence on connector capability manifest: "Each connector reports incremental sync / delete / permission-read support — the platform knows what it can do rather than assuming." |
| `/docs/search-rag` | Search & RAG | Hybrid retrieval, fused, filtered, then answered — with evidence identity all the way through. | Keep H2 "Permissions-aware by construction" — add the timing: "filtered during retrieval, not after generation, so a restricted document is never a candidate." |
| `/docs/knowledge-graph` | Knowledge graph | Versioned schema packs · evidence-gated extraction · bitemporal assertions. | Add one sentence on reversible merges: "A wrong merge is undone, not reconstructed." Keep the four H2s; they are already the clearest version on the site. |
| `/docs/workflows` | Workflows & pipelines | Typed, versioned graphs that resume from the last completed step. | Replace current subhead with: "Pipelines are declared as typed graphs and executed by a durable orchestration plane — checkpoints, retries, idempotency, dead-letter." Keep three H2s; add under Workflow Studio: "The Studio compiles the same contract the API executes — no drift between the visual and programmatic surfaces." |
| `/docs/app-builder` | App Builder | Generated code that goes through the same audited lifecycle as hand-written code. | Add the full lifecycle inline: "Intent → architect → scaffold → validate → proof lanes → seal → publish — recorded, versioned, reversible." |
| `/docs/governance` | Governance & security | Permissions, budgets, approvals, and audit — properties of the runtime, not conventions the app is trusted to follow. | Keep verbatim — this is already the best paragraph on the site. Elevate the deploy callout from a boxed aside to a first-class H2: "The same governance in every footprint." |

> **Cross-link pass (apply once):** Every doc page that names a platform offering should link back to that platform page. Every platform page should link down to its doc page. The site currently does this on ~60% of pages — make it 100%. That round-trip is what convinces a technical champion the marketing and the implementation are the same system.

---

## 21. Blog — `/blog`

**Current blog carries three strong posts that map to the three hardest sales:**

- *Enterprise vibe coding — why constraints beat speed* (`enterprise-vibe-coding`)
- *The knowledge graph labor problem* (`knowledge-graphs-labor-problem`)
- *Multi-axis memory architecture* (`multi-axis-memory-architecture`)

The blog's job is not volume; it is **to give the champion a forwardable artifact that wins the hallway argument when they are not in the room.**

### New copy — hub

```
Kicker:   Blog
H1:       Notes from the governed side of AI.
          (keep — strong, ownable)

Filter pills — keep: All posts · (category pills).

Empty state — current "No posts in this category yet." →
              "No posts in this category yet. All writing lives at /blog —
               no paywall, no newsletter gate."

Featured card — add reading time and a one-line verdict:

  e.g.  Enterprise Vibe Coding — 9 min
        Why governing the generation beats speeding it up — and how a public
        SDK is the only boundary that survives a security review.

Each row — keep, but add a category-colored bottom rule rather than a chip
        (fewer chips = less visual noise — the site already earns its one
         accent green).
```

### Editorial guidance for future posts (to include in this doc for the team)

- **Title like a briefing, not a blog.** "How LACE enforces permissions before the model reads" beats "Permissions in LACE."
- **Open with a hostile question** a CISO actually asks, then answer it with a mechanism from the code.
- **One product fragment per post.** Not a stock image. A screenshot of the real surface that proves the claim.
- **No paywall, no newsletter gate, RSS intact.** The blog is an argument asset, not a lead-capture funnel.
- **Suggested next three posts** (fill the gaps a champion needs):
  1. **"Bitemporal is not a feature flag"** — what restatements do to an enterprise without valid/transaction time, told through a Finance restatement example.
  2. **"Why the table cell matters"** — unit/scale/currency/period preservation, from `table_family_compiler` and `measurement_value` — the failure that benchmarks never catch.
  3. **"The agent that stopped"** — a real budget-ceiling and approval-gate trace, step by step, with cost attribution per channel.

---

## 22. 404 + small surfaces

**404 — `apps/lace/src/pages/404.astro`:**

Current: generic. Replace with a line that teaches the platform shape while being genuinely helpful:

```
H1:   This page does not exist — and unlike a hallucinated citation, we will tell you.
Body: The page you followed is not a route this site serves. But the platform
      probably has what you came for.
Cards:
  Enterprise Search → /platform/enterprise-search
  Knowledge Graph   → /platform/knowledge-graph
  Agent Studio      → /platform/agents
  App Builder       → /platform/app-builder
  Applications      → /applications
  Documentation     → /docs
  Contact           → /contact
CTA:  Back to home
```

> Keep the humor dry and the mechanism reference intact — it is on-brand and it earns its place on a page most visitors only hit by mis-typing.

**PDF placeholder — `public/LACE-Platform-Overview.pdf`:**

Not copy, but add a tiny line under the "Platform overview (PDF)" CTA on Home/Pricing:

```
"v3 — updated to reflect the four-offerings-on-one-substrate positioning.
 For deep evaluation, also see the in-product docs that ship with your release."
```

**Footer — `packages/site-kit/src/components/lace/LaceFooter.astro`:**

Keep. One edit — change the platform column order to match information hierarchy: Enterprise Search · Knowledge Graph · Agent Studio · App Builder — then Applications (LACE-GOV, Legal, Finance), then Resources (Docs, Blog, Pricing). Add `lace-app-sdk` as a standalone link under Resources with label `lace-app-sdk →` (currently buried inside App Builder).

**Nav megamenu — `LaceNav.astro`:**

Change the "Built on LACE" story pill copy from:

> "Launch and monetize your own app — App Builder + lace-app-sdk · billing & rollback built in"

to:

> "Build, host, and bill — App Builder + lace-app-sdk · every app versioned, every release reversible"

More concrete, less stack-of-nouns.

---

## 23. SEO titles & descriptions (recommended)

Every page already emits correct `title` + `description` + canonical + JSON-LD. The table below is a sharpening pass that keeps length inside the ~58 char / ~155 char budgets and foregrounds the wedge keyword per page.

| Route | Title (≤ 58) | Description (≤ 155) |
|---|---|---|
| `/` | Governed Enterprise AI Platform — Search, Graph, Agents, Apps \| LACE | LACE turns company knowledge into cited answers, an evidence-locked graph, governed agents, and versioned apps — permissions-aware, auditable, any deployment footprint. |
| `/platform/enterprise-search` | Enterprise Search with Cited Answers \| LACE | Permissions-aware search across SharePoint, Drive, Slack, email, S3 and more — hybrid retrieval with cited answers that open the passage they came from. |
| `/platform/knowledge-graph` | Evidence-Locked Knowledge Graph \| LACE | Bitemporal graph where every fact carries a receipt: source passage, valid time and transaction time, human-reviewed, conflict-detected, BFO/CCO-ready. |
| `/platform/agents` | Governed AI Agents — Every Channel \| LACE | Build agents inside capabilities, budgets and approval gates. Deploy to chat, Slack, Teams, email, SMS, WhatsApp, voice — with traces and cost per channel. |
| `/platform/app-builder` | AI App Builder — Prompt to Governed App \| LACE | Describe an app, build in an isolated sandbox, proof through real lanes, publish a versioned release at a live URL — auth, data, billing and rollback included. |
| `/applications` | Enterprise AI Applications \| LACE | LACE-built products for government, legal and finance — plus the App Builder that lets you ship your own, on the same governed substrate. |
| `/applications/lace-gov` | LACE-GOV — Air-Gapped Federal AI \| LACE | Air-gapped or inside your enclave, BFO/CCO-conformant, cross-enclave federation without data movement, with exportable accreditation evidence. |
| `/applications/lace-legal` | LACE Legal — Contract Intelligence \| LACE | Obligation tracking, renewal and conflict surveillance across versions, clause-level citations, bitemporal point-in-time queries for investigation. |
| `/applications/lace-finance` | LACE Finance — Traceable Financial Research \| LACE | Table-native figures with unit, scale, currency and period — auditable workflows, information-barrier enforcement and policy-bound agents. |
| `/pricing` | Pricing & Deployment — One Platform, Any Footprint \| LACE | All four offerings on one contract, priced by deployment scope: managed cloud, private VPC, on-premises, fully air-gapped. Scope with us. |
| `/contact` | Book a LACE Evaluation — On Your Documents \| LACE | Scope an NDA evaluation on your corpus and workflow — managed cloud, private cloud, on-premises or air-gapped. Reply within one business day. |
| `/docs` | LACE Docs — Platform & lace-app-sdk \| LACE | The governed substrate behind the marketing pages: manifests, data collections, tools, agents, datasets, hybrid retrieval and the BFO/CCO knowledge graph. |
| `/blog` | Notes from the Governed Side of AI \| LACE | Engineering and product writing from the LACE team: evidence-first retrieval, bitemporal graphs, agent governance, air-gapped AI. |

> JSON-LD: no new schema types required. Keep `SoftwareApplication` as `LACE` + `TechArticle` per doc page + `FAQPage` where present. Do not add `AggregateRating` or `Organization/review` — no review corpus exists and schema review fabrication is detectable.

---

## 24. What to measure, and what to build next

**What to measure after lifting this copy (no instrumentation change required):**

- **Forwardability:** the metric is not time-on-page but forwards-to-security. Add a post-form field (voluntary, one click): "How did you hear about this page? · Forwarded by colleague" — that is the conversion that matters for a committee sale.
- **Pricing-to-contact rate per tier click.** The new pricing gives each tier a human — track hover/click distribution to see which persona you attract.
- **Docs egress vs. pricing egress.** If docs egress dominates, the marketing pages are not scannable enough. If pricing egress dominates but contact conversion is low, pricing is not decisive enough.
- **Contact form — deployment-select distribution.** This is the packaging signal. If "Not sure yet" > 40%, the deployment boundary story has not landed on the offering pages.

**What this site still needs beyond copy (out of scope — listed, not designed):**

- **One real pilot video — on a real corpus the team is willing to name.** Not the current `kg-assistant.mp4` looping the same graph rotation, but a screen capture of a typed query → cited answer → open cited passage → graph fact → point-in-time scrub. Sixty seconds, no voice-over, citations doing the talking.
- **A one-page "How LACE governs" architecture diagram** that ships as a downloadable PDF and as an SVG on `/docs/governance` — pipelines, agent control plane, retrieval, graph, app sidecars, all drawn on one substrate with the enforcement points marked. The current architecture text is strong; a diagram doubles its forwardability.
- **Pricing packaging validation with Design.** The page currently claims "High-touch delivery by a team with DoD/USAF pedigree" and "BFO/CCO conformance artifacts" on the Gov tier — `PRODUCT.md` flags both as unverified as publicly claimable. Resolve before extending.

---

## 25. Appendix A — Differentiator → copy line map

So every new line can be defended with a file blame, not just a feeling.

| Marketing claim in this proposal | Implementation that makes it true | File to point the reviewer at |
|---|---|---|
| "Permissions enforced at retrieval, before the model reads" | ACL snapshots stored on ingest, filtered at SQL/lexical time, not post-LLM | `src/lace/domain/ingest/`, `src/lace/domain/rag/`, `src/lace/api/handlers/enterprise_search_support.py`, `src/lace/auth/permissions.py` |
| "Budgets with hard ceilings — enforced at execution, not advised after" | Execution plane checks before dispatch; agent stops & escalates if ceiling exceeded | `src/lace/execution/`, `src/lace/agent/runtime/control_plane.py` |
| "Every output cites its source; click opens the passage/cell/row" | Stable document/block/span identity; lexical + pgvector; evidence contracts | `src/lace/domain/parsing/`, `src/lace/domain/rag/`, `src/lace/domain/schema_extraction/` |
| "Bitemporal — valid time vs. transaction time; corrections supersede, never erase" | `valid_time` + `transaction_time` on assertions; close-and-supersede, no in-place edit | `src/lace/domain/schema_extraction/store.py`, `src/lace/domain/kernel/` (`assertion-kernel.md`, `lace_schema.semantic_assertion_version`) |
| "Candidate-first, evidence-gated; low-confidence queues for review" | Candidate layer → validation/gounding/fusion → governed materialization policy | `src/lace/domain/schema_extraction/` (pipeline + steps), `frontend/src/components/schema-studio/` |
| "One agent control plane — web chat, Slack, Teams, email, SMS, WhatsApp, voice" | Normalized channels with consent, retry, handoff, media, usage/cost per channel | `src/lace/agent/product/channels/`, `src/lace/agent/runtime/` |
| "Approval gates that pause execution; revoked mid-run honored on next dispatch" | User-authored tools in constrained runtimes; trust-tier + permissions checked per dispatch | `src/lace/agent/product/`, `src/lace/tools/`, `src/lace/api/routes/agents.py` |
| "Typed, versioned pipelines — durable execution; resume from last completed step" | `PipelineDefinition` / `StepSpec`, checkpoints, idempotency, dead-letter | `src/lace/pipeline/definition.py`, `src/lace/execution/`, `src/lace/control_plane/` |
| "Isolated sandbox; SDK is the only capability surface" | Builder lifecycle + `lace-app-sdk` facet over live contracts; sidecars as isolated runtimes | `src/lace/builder/`, `src/lace_app_sdk/`, `src/lace_runtime/`, `src/lace/apps/` |
| "Four deployment footprints — managed cloud, private VPC, on-premises, air-gapped" | Docker Compose locally, ECS Fargate via Terraform in cloud, ECP as serverless env plane | `docker-compose.yml`, `infra/aws/`, `ecp/` |
| "Table-native answers — unit, scale, currency, period preserved" | Structure-preserving parse into table/cell locators; `measurement_value` with exact `NUMERIC` | `src/lace/domain/table_family_compiler/`, `src/lace/domain/kernel/`, `src/lace/domain/parsing/` |
| "Hybrid retrieval — lexical + vector fused with RRF" | `retrieval` strategy + `rrf` fusion + optional GPU reranker (settings-gated) | `src/lace/domain/rag/retrieval.py`, `src/lace/domain/retrieval/rrf.py`, `services/reranker/` |
| "App manifest is blast radius — if not declared, it does not run" | `LaceAppManifest`, provider discovery, tool/agent/data-collection providers | `src/lace_app_sdk/_contracts/manifest.py`, `src/lace/apps/discovery.py` |

---

## 26. Appendix B — Competitor copy we are beating

Not for the site — for the team, so everyone knows which sentence they are trying to outrun.

| Competitor tells the buyer | Why it sounds compelling | LACE's one-sentence kill (use in conversation, not on the homepage) |
|---|---|---|
| "We connect to everything." (Glean) | They do — good connectors, proven scale. | "So do we — but our search answer includes which passage it came from, under whose permission, with the previous version still queryable when the document is revised." |
| "We are the knowledge graph company." (Palantir, neo4j-backed tooling) | Graph sounds like intelligence. | "Most graphs are summaries without receipts. Ours is a ledger: candidate → validation → human approval → bitemporal assertion, with the source span pinned to every fact." |
| "Our agents are autonomous." (OpenAI, LangChain-providers, Sierra) | Autonomy sounds like savings. | "Our agents are capable — the governance is what is autonomous. Permissions, budgets, and approvals are enforced by a service the model never sees, so autonomy cannot talk itself past a gate." |
| "Generate an app from a prompt." (v0, Lovable, Bolt, Replit) | Fast is viscerally appealing. | "We do too — then we proof it, seal it, version it, host it, and let you roll it back. Speed without a lifecycle is just a faster way to ship an incident." |
| "Build AI with open source pieces." (LangChain + vector DB crowd) | Composability reassures engineers. | "You already live that — and you became the orchestration layer. We give you typed pipelines, durable execution, a real identity plane, and air-gapped parity so you can stop being the platform and go back to being the builder." |

---

## 27. Appendix C — Files referenced

Repository reads that informed this proposal (representative, not exhaustive):

- Core product: `/home/mkern/LACE/README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/agent/architecture-map.md`, `docs/LACE_PIPELINE_TECHNICAL_WHITEPAPER.md`, `docs/platform/*.md`, `pyproject.toml`, `src/lace/{agent,pipeline,domain,builder,apps,api,auth,connectors,execution,control_plane}/`, `frontend/src/`, `src/lace_app_sdk/`, `src/lace_runtime/`, `services/reranker/`, `infra/aws/`, `ecp/README.md`
- Deep dives: `docs/agent/enterprise-search.md`, `docs/agent/schema-extraction.md`, `docs/agent/assertion-kernel.md`, `docs/designs/kg-design/LACE_ONTOLOGY_RUNTIME_V1_2026-08-04.md`, `docs/spec/ENTERPRISE_SEARCH_PRODUCTION_V1_SPRINT_2026-07-20.md`
- Website as built: `/home/mkern/lace-com/apps/lace/PRODUCT.md`, `DESIGN.md`, `src/site.config.ts`, `src/pages/{index,pricing,contact,applications}.astro`, `src/pages/platform/{enterprise-search,knowledge-graph,agents,app-builder}.astro`, `src/pages/applications/{lace-gov,lace-legal,lace-finance}.astro`, `src/pages/docs/*.astro`, `src/pages/blog/index.astro`, `src/layouts/DocsPage.astro`, `packages/site-kit/src/components/lace/{LaceHomePage,LacePricingPage,LaceOfferingShell,LaceNav,LaceFooter,LaceSearchDemo,LaceKgVideo,LaceBuildDemo,LaceSaasStack,LaceAppSdk,LacePlatformMap,LaceMcpSection}.astro`, `packages/site-kit/src/styles/{lace-site,lace-grid}.css`, `docs/SEO-STRATEGY.md`
- Positioning ancestors (read for mechanism, not for naming): `docs/LACE-LANDING-PAGE-CONTENT.md`, `LACE_GENTLE_INTRO.md`, `LACE BUSINESS PLAN.md` — superseded by `PRODUCT.md` and `src/site.config.ts`

---

### How to use this doc

1. **Treat section 7 as the lock.** Once leadership picks one of the ranked one-liners, the rest of the pages follow — it is the pin every hero hangs from.
2. **Lift per page.** Each of sections 9–22 gives a drop-in H1/subhead/grid/card/FAQ that maps 1:1 to the Astro props the site already renders (`kicker`, `title`, `lead`, `points`, `practice`, `deepTitle`, etc.). A developer can copy the block into the page's `content = {...}` and the build stays green.
3. **Keep the SEO table in section 23 as the single source for `title` + `description`.** It is length-checked and wedge-keyworded per page.
4. **Do not invent logos, testimonials, metrics, or compliance badges to fill a cell.** An honest cell that says "Evaluations are judged on your corpus, under NDA — you grade the citations, not our benchmarks" beats a fabricated "97% accurate" every time with the buyer who matters.

---

*Written from the repo, not from the brochure. Every headline here is a sentence the code can defend when the reviewer's turn comes.*
