/**
 * Navigation model for /docs.
 *
 * The docs used to be one page with `#fragment` anchors, which meant Google
 * indexed a single URL no matter how much material sat under it. Each entry
 * here is a real route with its own title and description, so the long-tail
 * technical queries developers and architects actually type have a page to land
 * on. The shell renders the sidebar, the tab row, and prev/next from this list —
 * adding a page means adding an entry plus the matching file under
 * `apps/lace/src/pages/docs/`.
 */

export interface DocsNavItem {
  /** Route slug; "" is the /docs index. */
  slug: string;
  /** Sidebar label. */
  label: string;
  /** <title> text, without the site suffix. */
  title: string;
  /** Meta description and the summary used in the docs index. */
  description: string;
}

export interface DocsNavGroup {
  group: string;
  /** Tab this group belongs to in the docs header. */
  tab: string;
  items: DocsNavItem[];
}

export const docsNav: DocsNavGroup[] = [
  {
    group: "Get Started",
    tab: "Documentation",
    items: [
      {
        slug: "",
        label: "Introduction",
        title: "LACE Platform & App SDK Documentation",
        description:
          "Documentation for the LACE platform and the lace-app-sdk: install, quickstart, manifest, data, tools, agents, connectors, retrieval, workflows, and governance.",
      },
      {
        slug: "organization",
        label: "How LACE is organized",
        title: "How the LACE Platform Is Organized",
        description:
          "How the LACE platform is structured: pipelines, agents, apps, knowledge, and the assistant sharing one tenant-scoped control plane with enforced permissions and evidence.",
      },
      {
        slug: "deployment",
        label: "Deployment options",
        title: "Deployment Options: Cloud, VPC, On-Premises, Air-Gapped",
        description:
          "Deploy LACE to managed cloud, your own VPC, on-premises hardware, or a fully air-gapped enclave with no external AI calls. The governance substrate is identical in every footprint.",
      },
    ],
  },
  {
    group: "lace-app-sdk",
    tab: "SDK Reference",
    items: [
      {
        slug: "install",
        label: "Install",
        title: "Install the lace-app-sdk",
        description:
          "Install lace-app-sdk, the public versioned contract surface for building governed enterprise AI applications on LACE. Requires Python 3.11 or later.",
      },
      {
        slug: "quickstart",
        label: "Quickstart",
        title: "Quickstart: Build a Governed App",
        description:
          "Build a governed LACE application from four small files: the manifest, a data collection, a tool provider, and an agent definition.",
      },
      {
        slug: "manifest",
        label: "Manifest",
        title: "LaceAppManifest Reference",
        description:
          "LaceAppManifest declares an app's routes, tools, pipelines, agents, data collections, UI, schedules, and migrations. LACE discovers manifests and wires providers at bootstrap.",
      },
      {
        slug: "data-collections",
        label: "Data collections",
        title: "App Data Collections & Blob Storage",
        description:
          "Declare typed, tenant-scoped data collections with JSON Schema and serve them through the governed AppDataService, with automatic admin panels and audited blob storage.",
      },
      {
        slug: "tools",
        label: "Tools",
        title: "Custom Tools & Tool Providers",
        description:
          "Expose custom tools to LACE agents with AppToolProvider. Tools run in constrained runtimes with trust tier and permissions checked before every dispatch.",
      },
      {
        slug: "agents",
        label: "Agents & skills",
        title: "Agent Definitions, Skills & Approval Gates",
        description:
          "Declare an AgentDefinition to run a real agentic loop in your sidecar, with platform-enforced capabilities, loop guards, reusable skills, and human approval gates.",
      },
      {
        slug: "modules",
        label: "Module reference",
        title: "lace-app-sdk Module Reference",
        description:
          "Reference for every lace-app-sdk module: manifest, data, tools, agents, skills, pipelines, routes, connectors, memory, policy, migrations, ui, and testing.",
      },
    ],
  },
  {
    group: "Platform Guide",
    tab: "Platform Guide",
    items: [
      {
        slug: "datasets",
        label: "Datasets & connectors",
        title: "Datasets & Enterprise Connectors",
        description:
          "Connect SharePoint, Google Drive, OneDrive, Dropbox, Notion, Slack, email, S3, databases, and websites, with scheduled sync, change reconciliation, and permission snapshots.",
      },
      {
        slug: "search-rag",
        label: "Search & RAG",
        title: "Hybrid Search & Permissions-Aware RAG",
        description:
          "Hybrid retrieval fuses lexical and vector legs with reciprocal-rank fusion, filters by source ACLs, and reranks on GPU, with stable document, block, and span identity.",
      },
      {
        slug: "knowledge-graph",
        label: "Knowledge graph",
        title: "Knowledge Graph, Schema Packs & Bitemporal Facts",
        description:
          "Versioned executable ontology contracts, candidate-first evidence-gated extraction, reversible identity resolution, and bitemporal assertions that supersede rather than erase.",
      },
      {
        slug: "agents-channels",
        label: "Agents & channels",
        title: "Agent Control Plane & Messaging Channels",
        description:
          "One control plane for sessions, tasks, streaming, steering, and cancellation, across email, SMS, WhatsApp, Slack, Teams, webhooks, and realtime voice.",
      },
      {
        slug: "workflows",
        label: "Workflows & pipelines",
        title: "Workflows & Pipelines",
        description:
          "Versioned graphs of typed steps with checkpoints, retries, idempotency, and dead-letter handling. Workflow Studio compiles the same contract the API executes.",
      },
      {
        slug: "app-builder",
        label: "App Builder",
        title: "App Builder: Prompt to Published Application",
        description:
          "Describe an application and the builder plans it, constructs it in a sandbox, validates it through proof lanes, and publishes it as an isolated sidecar with versioned releases.",
      },
      {
        slug: "governance",
        label: "Governance & security",
        title: "Governance, Security & Auditability",
        description:
          "Permission scopes, resource ACLs, budgets, usage limits, approval gates, structured logs, OpenTelemetry traces, and per-call model attribution for every AI operation.",
      },
    ],
  },
];

/** Flat, ordered list — drives prev/next and lookup by slug. */
export const docsPages: DocsNavItem[] = docsNav.flatMap((group) => group.items);

export const docsHref = (slug: string) => (slug ? `/docs/${slug}` : "/docs");

/** The tab a slug sits under, so the header highlights the right one. */
export const docsTabForSlug = (slug: string) =>
  docsNav.find((group) => group.items.some((item) => item.slug === slug))?.tab ?? "Documentation";

/** First page of each tab — the tab links point here. */
export const docsTabs = docsNav.map((group) => ({
  tab: group.tab,
  href: docsHref(group.items[0].slug),
}));

export const docsPageBySlug = (slug: string) =>
  docsPages.find((item) => item.slug === slug);

export const docsPrevNext = (slug: string) => {
  const index = docsPages.findIndex((item) => item.slug === slug);
  return {
    prev: index > 0 ? docsPages[index - 1] : undefined,
    next: index !== -1 && index < docsPages.length - 1 ? docsPages[index + 1] : undefined,
  };
};
