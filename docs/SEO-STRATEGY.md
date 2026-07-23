# Organic Search Strategy: Determinant Systems + LACE

Last updated: 2026-07-23

## Executive positioning

The two domains must reinforce each other without competing for the same query intent:

- **determinantsystems.com** is the services and expertise domain. It should rank for consulting, engineering, development, implementation, and integration searches.
- **laceplatform.com** is the software and product domain. It should rank for platform, product, feature, documentation, deployment, and pricing searches.

Determinant Systems is the organization and publisher. LACE is its enterprise AI software platform. The sites link to one another using that relationship, and the structured entity graph identifies LACE as software published by Determinant Systems.

## Baseline audit

On 2026-07-23, exact `site:` searches for both domains returned no Google results. Both apex sites returned `200`, exposed crawlable HTML, and published sitemap indexes. No repository-controlled `robots.txt` or page-level `noindex` blocked the intended pages.

Two production issues were found:

1. `www.determinantsystems.com` and `www.laceplatform.com` returned duplicate `200` pages instead of redirecting to the apex hosts.
2. `https://laceplatform.com/product/` was submitted in the sitemap despite carrying `noindex` and a client-side refresh.

The second issue is fixed in this repository. The first requires Cloudflare account configuration described under Launch Actions.

## Search architecture and keyword map

The terms below are primary themes, not instructions to repeat exact phrases unnaturally. Pages should answer the full user intent and use natural variants, entities, systems, and problems around each theme.

### determinantsystems.com

| URL | Search intent | Primary theme | Supporting themes |
| --- | --- | --- | --- |
| `/` | Find an enterprise AI engineering partner | enterprise AI consulting and engineering | governed AI systems, enterprise AI company, AI integration |
| `/services/` | Compare delivery capabilities | enterprise AI consulting services | AI development services, AI implementation |
| `/services/ai-agent-development/` | Hire a team to build production agents | enterprise AI agent development | AI agent consulting, governed agents, agent deployment |
| `/services/custom-ai-application-development/` | Build a purpose-specific AI application | custom AI application development | enterprise AI apps, AI software development |
| `/services/ai-workflow-automation/` | Automate a real business process with AI | enterprise AI workflow automation | LLM workflow automation, document workflow AI |
| `/services/retrieval-augmented-generation/` | Build or improve a RAG system | enterprise RAG development and consulting | retrieval-augmented generation, RAG evaluation, cited AI answers |
| `/services/enterprise-search/` | Implement company-wide search | enterprise search consulting and implementation | semantic search, hybrid search, permissions-aware search |
| `/services/knowledge-graphs/` | Build a graph from enterprise data and documents | enterprise knowledge graph development | ontology consulting, entity resolution, bitemporal knowledge graph |
| `/about/` | Validate the company and its expertise | Determinant Systems | enterprise AI engineering firm, LACE publisher |
| `/contact/` | Speak with the engineering team | enterprise AI consultation | AI engineering contact, LACE implementation |
| `/es/` | Spanish-language company discovery | consultoría de IA empresarial | ingeniería de IA, agentes gobernados, RAG empresarial |

### laceplatform.com

| URL | Search intent | Primary theme | Supporting themes |
| --- | --- | --- | --- |
| `/` | Evaluate an integrated enterprise AI platform | enterprise AI platform | governed AI platform, enterprise search and agents |
| `/platform/enterprise-search/` | Evaluate search software | enterprise search platform | permissions-aware search, cited AI answers, federated search |
| `/platform/knowledge-graph/` | Evaluate graph software | enterprise knowledge graph platform | knowledge graph provenance, bitemporal graph, BFO/CCO |
| `/platform/agents/` | Evaluate an agent platform | enterprise AI agent platform | governed AI agents, agent evaluation, omnichannel AI agents |
| `/platform/app-builder/` | Build governed apps with AI | enterprise AI app builder | governed SDK, internal tool builder, enterprise vibe coding |
| `/applications/` | Find industry-specific products | enterprise AI applications | government AI, legal AI, financial services AI |
| `/pricing/` | Compare deployment and commercial options | enterprise AI platform pricing | private cloud AI, on-premises AI, air-gapped AI |
| `/docs/` | Implement or validate the developer surface | LACE documentation and app SDK | AI agent SDK, governed app SDK, platform API |
| `/blog/` | Learn from original engineering work | enterprise AI engineering blog | RAG, knowledge graphs, agents, app builder, deployment |
| `/blog/enterprise-vibe-coding/` | Understand a safer architecture for generated apps | enterprise vibe coding | governed AI app builder, capability boundaries, sandboxed code |
| `/contact/` | Request an evaluation | enterprise AI platform demo | LACE demo, technical evaluation |

## Implemented technical standard

- Unique, intent-aligned titles and meta descriptions on every indexable page.
- One descriptive `h1` per indexable page and a corrected heading hierarchy in documentation.
- Absolute self-referencing canonicals derived from each production origin.
- Index directives that allow full snippets, large image previews, and video previews.
- Open Graph and Twitter metadata with absolute 1200×630 images and descriptive image alternatives.
- Reciprocal HTML and XML-sitemap `hreflang` annotations for the English and Spanish Determinant homepages, including `x-default`.
- XML sitemap indexes containing only canonical, indexable pages.
- `robots.txt` files that allow crawling and advertise the correct sitemap index.
- A permanent Cloudflare Pages redirect for LACE `/product` to `/platform/enterprise-search`.
- Connected JSON-LD entity graphs: `Organization`, `WebSite`, `WebPage`, `ImageObject`, `SoftwareApplication`, `Service`, `BreadcrumbList`, `FAQPage`, `ItemList`, and `BlogPosting` where the visible page supports them.
- An RSS feed for LACE editorial content at `/rss.xml`.
- Custom, helpful 404 pages that remain out of the index.
- A build-time SEO regression test covering canonicals, indexability, sitemap parity, title and description uniqueness, heading count, robots declarations, and JSON-LD syntax.

## Content and authority roadmap

Technical SEO makes pages eligible; it does not create authority by itself. The next publishing work should prioritize evidence of first-hand expertise:

1. Publish cleared Determinant case studies describing the initial problem, architecture, constraints, evaluation method, and measurable outcome. Do not publish the anonymized placeholder customer stories until every claim is authorized.
2. Add an author profile for each recurring LACE writer with relevant background and links from article bylines.
3. Publish two high-quality LACE technical articles per month. Strong first clusters are RAG evaluation, source permissions, bitemporal graphs, agent approval design, air-gapped deployment, and governed app architecture.
4. Publish implementation guides that support product pages, then link each guide bidirectionally to its relevant product page.
5. Add comparison or alternative pages only when they can make factual, maintained comparisons. Do not create templated competitor pages for keyword coverage alone.
6. Add real customer logos, quotes, security documents, certifications, and performance evidence only after approval. Do not manufacture trust signals.

## Launch actions outside the repository

These actions require access to Google or Cloudflare and cannot be completed by a code change:

1. **Deploy this build before requesting recrawl.** Confirm production HTML, sitemap contents, redirects, and response codes after deployment.
2. **Create a Google Search Console Domain property for each domain.** Verify by DNS so all protocols and subdomains are covered.
3. **Submit each sitemap index:**
   - `https://determinantsystems.com/sitemap-index.xml`
   - `https://laceplatform.com/sitemap-index.xml`
4. **Inspect and request indexing for the two homepages and key hubs.** Start with Determinant `/`, `/services/`, and LACE `/`, then inspect the four LACE platform pages. Do not repeatedly submit unchanged URLs.
5. **Configure Cloudflare Bulk Redirects:**
   - `www.determinantsystems.com/*` → `https://determinantsystems.com/:splat` with `301`, path suffix, and query string preserved.
   - `www.laceplatform.com/*` → `https://laceplatform.com/:splat` with the same settings.
   - Redirect each public `*.pages.dev` deployment hostname to its canonical custom domain.
6. **Review Cloudflare managed robots controls.** Keep `search=yes` and do not add a `Googlebot` disallow. `Google-Extended` controls model training/grounding use and is separate from ordinary Google Search crawling.
7. **Connect measurement.** Link Search Console to the analytics property, record form submissions as conversions, and monitor non-brand queries, indexed-page count, crawl errors, and conversions by landing page.
8. **Strengthen first-party entity links.** Make the canonical domains the website links on the Determinant LinkedIn and GitHub organization profiles, and keep the company name, description, logo, phone, and ownership relationship consistent.
9. **Validate after every production release.** Run URL Inspection, Rich Results Test, PageSpeed Insights, and mobile checks on representative templates. Watch Search Console's Pages and Enhancements reports for new errors.

## 30/60/90-day measurement

### First 30 days

- Both domain properties verified and sitemaps processed without errors.
- All submitted canonical pages discovered; indexing reasons reviewed for exclusions.
- `www` and `pages.dev` duplicates return a single-hop `301` to the canonical host.
- Brand searches begin returning the correct homepages.

### Days 31–60

- First approved case study and at least two original technical articles published.
- Impressions appear for the mapped non-brand themes.
- Query/page mismatches used to refine titles, introductions, internal anchors, and FAQs.

### Days 61–90

- Evaluate qualified organic conversions by landing page, not rankings alone.
- Expand the content clusters that earn impressions and engagement.
- Consolidate or improve pages that Google crawls but consistently declines to index.
- Pursue relevant editorial links through partners, engineering communities, conference material, and original research—not paid or mass-produced link schemes.

## Reference guidance

- [Google Search developer guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google robots meta guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare www-to-apex redirects](https://developers.cloudflare.com/pages/how-to/www-redirect/)

