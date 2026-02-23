export const themes = [
  {
    id: "midnight",
    label: "Midnight",
    note: "Dark, subtle glow, product-first presentation."
  },
  { id: "blueprint", label: "Blueprint", note: "Crisp systems aesthetic." },
  { id: "circuit", label: "Circuit", note: "Sharp neon flow-map energy." },
  { id: "forge", label: "Forge", note: "Warm industrial architecture tone." }
];

export const problemFlowSteps = [
  {
    step: "01",
    title: "Collect Everything Into One Prompt",
    userAction:
      "You gather policies, templates, source files, old deliverables, and requirements into one giant chat prompt.",
    struggle:
      "Critical context gets trimmed, skipped, or buried before the model starts writing."
  },
  {
    step: "02",
    title: "Try To Force A Specific Format",
    userAction:
      "You describe exact section order, response style, mandatory headings, and strict structure rules.",
    struggle:
      "Output drifts from the required format, so you spend cycles re-prompting and restructuring."
  },
  {
    step: "03",
    title: "Chase Citation Quality",
    userAction:
      "You request source-grounded writing with explicit references and no fabricated claims.",
    struggle:
      "You still need manual checks for unsupported statements, weak citations, and hallucination risk."
  },
  {
    step: "04",
    title: "Patch Section By Section",
    userAction:
      "You regenerate chunks repeatedly to fix tone, gaps, and consistency across a long document.",
    struggle:
      "Each new edit can break earlier sections and trigger another expensive review pass."
  },
  {
    step: "05",
    title: "Run A Final Manual Rescue",
    userAction:
      "You manually reconcile style, structure, references, and requirements before submission.",
    struggle:
      "The team becomes the orchestration layer. AI helps, but it does not reliably work for your business context."
  }
];

export const valuePillars = [
  {
    title: "Context-Aware By Default",
    copy: "LACE works from your company standards, project constraints, policies, and source material so output actually fits your environment."
  },
  {
    title: "Built For Long Documents",
    copy: "From proposal volumes to technical plans, LACE handles large artifacts without losing the thread."
  },
  {
    title: "Consistent Voice And Structure",
    copy: "Keep style, terminology, and section quality aligned across the entire document, not just one page."
  },
  {
    title: "Grounded, Verifiable Output",
    copy: "LACE is designed to reduce hallucinations by grounding writing in your real source documents, checking claims against available evidence, and producing citation-ready sections for review."
  }
];

export const workflowSteps = [
  {
    step: "01",
    title: "Load Your Working Context",
    description:
      "Bring in your policies, templates, prior documents, requirements, and source data."
  },
  {
    step: "02",
    title: "Generate With Guardrails",
    description:
      "LACE builds and refines sections with your structure and goals in view, not as isolated chat answers."
  },
  {
    step: "03",
    title: "Review, Regenerate, Deliver",
    description:
      "Focus regeneration where needed, keep decisions traceable, and publish final deliverables with confidence."
  }
];

export const useCases = [
  "RFP and government proposal responses",
  "Technical modernization and architecture plans",
  "Compliance and policy documentation",
  "Program-level operating playbooks",
  "Knowledge engineering and ontology-backed artifacts"
];

export const screenshotPlaceholders = [
  {
    title: "Workspace Dashboard",
    caption: "Pipeline status, artifact progress, and review queue."
  },
  {
    title: "Section Composer",
    caption: "Context-aware drafting with structure and style guidance."
  },
  {
    title: "Traceability View",
    caption: "Source mapping, change history, and approval flow."
  }
];

export const trustItems = [
  "Works for SaaS and enterprise on-prem environments",
  "Supports sensitive and regulated documentation workflows",
  "Integrates with your preferred model providers",
  "Designed for auditable, repeatable document production"
];

export const deploymentOptions = [
  "Cloud-hosted workspace",
  "Dedicated enterprise install",
  "On-prem deployment",
  "API-driven integration into existing workflows"
];
