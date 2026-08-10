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
        slug: "architecture",
        label: "Architecture overview",
        title: "LACE Architecture Overview",
        description:
          "The LACE control plane, app framework, execution runtimes, knowledge stack, and platform data stores — and how a request flows through them.",
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
          "Install lace-app-sdk, the public contract for building governed enterprise AI applications on LACE. Requires Python 3.12 or later.",
      },
      {
        slug: "quickstart",
        label: "Quickstart",
        title: "Quickstart: Build a Governed App",
        description:
          "Build a governed LACE application from four small files: the manifest, a data collection, a tool provider, and an agent definition.",
      },
      {
        slug: "create-app",
        label: "Create a new app",
        title: "Create a New App — UI, API & CLI",
        description:
          "Create a LACE app three ways: from the App Builder UI, from the REST API, or from the lace-app CLI. Same manifest, same contracts, three entry points.",
      },
      {
        slug: "clone-and-dev",
        label: "Clone & local dev",
        title: "Clone the Repo & Run Locally",
        description:
          "Clone a graduated app repo with lace-app clone, run it locally with lace-app dev, and understand the compose stack, emulator, and .lace state.",
      },
      {
        slug: "what-you-get",
        label: "What gets installed",
        title: "What Gets Installed — Project Layout",
        description:
          "The file tree, manifests, generated scaffolding, templates, and dependencies that a new LACE app installs — and what each file owns.",
      },
      {
        slug: "sdk-overview",
        label: "The SDK itself",
        title: "The lace-app-sdk",
        description:
          "How the SDK re-exports live lace.* code, the base and runtime installs, versioning, and the full module map.",
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
        slug: "pipelines",
        label: "Pipelines",
        title: "Pipelines — Typed Workflow Graphs",
        description:
          "Declare pipelines as versioned, typed graphs of steps with checkpoints, retries, idempotency, and dead-letter handling — compiled the same way the platform executes them.",
      },
      {
        slug: "routes-ui",
        label: "Routes & UI",
        title: "Routes & Runtime UI",
        description:
          "Expose HTTP routes and federated runtime-UI modules from your app sidecar. Routes mount at /apps/<app_id>/api/*, UI at /ui/manifest.json.",
      },
      {
        slug: "testing",
        label: "Testing & proof lanes",
        title: "Testing & Proof Lanes",
        description:
          "Validate apps locally with lace-app test: typecheck, build, route smoke, tool invocation, permission, and AppData contract lanes.",
      },
      {
        slug: "publishing",
        label: "Publishing & releases",
        title: "Publishing, Releases & Rollback",
        description:
          "Seal, push, deploy, and version your app. Releases are immutable, content-addressed, and one rollback away.",
      },
      {
        slug: "cli",
        label: "CLI reference",
        title: "lace-app CLI Reference",
        description:
          "The lace-app CLI: auth, create, clone, dev, test, push, deploy, open, logs, status, releases, and secrets — with flags, env vars, and examples.",
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
        slug: "enterprise-search",
        label: "Enterprise Search",
        title: "Enterprise Search — Cited, Permissions-Aware Answers",
        description:
          "Product walkthrough for Enterprise Search: three-leg retrieval, RRF fusion, ACL enforcement, GPU reranking, and cited answers that never leak what you cannot see.",
      },
      {
        slug: "knowledge-graph",
        label: "Knowledge Graph",
        title: "Knowledge Graph — Schema Packs & Bitemporal Facts",
        description:
          "Versioned executable ontology contracts, candidate-first evidence-gated extraction, reversible identity resolution, and bitemporal assertions that supersede rather than erase.",
      },
      {
        slug: "agent-studio",
        label: "Agent Studio",
        title: "Agent Studio — Governed Agents on Every Channel",
        description:
          "Product walkthrough for Agent Studio: design the tool surface, write the system prompt, wire channels, enforce policy, and ship to web, email, SMS, and voice.",
      },
      {
        slug: "workflows",
        label: "Workflows & Pipelines",
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
  {
    group: "API & Platform",
    tab: "API Reference",
    items: [
      {
        slug: "api-overview",
        label: "REST API & other SDKs",
        title: "REST API, SDKs & Integration Surfaces",
        description:
          "The /v1 REST API, lace-app-sdk (Python), frontend SDKs, CLI, webhooks, events, and MCP — auth, versioning, pagination, and errors.",
      },
      {
        slug: "authentication",
        label: "Authentication",
        title: "Authentication, Tenancy & Authorization",
        description:
          "API keys, JWTs, tenant scoping, RBAC scopes, resource ACLs, and the policy checks that guard every route, tool, and retrieval path.",
      },
      {
        slug: "observability",
        label: "Observability",
        title: "Observability — Logs, Traces & Metrics",
        description:
          "Structured logs, OpenTelemetry traces, per-call model attribution, pipeline replay, agent session inspection, and cost dashboards.",
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
