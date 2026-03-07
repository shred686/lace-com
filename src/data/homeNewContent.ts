export const heroProofs = [
  "Model business workflows",
  "Policy-governed execution",
  "Deployable AI apps"
];

export const capabilityTags = [
  "Enterprise AI",
  "Workflow Modeling",
  "Deterministic Pipelines",
  "Policy Controls",
  "Run Supervision",
  "App Publishing"
];

export const companyBullets = [
  "Model a business use case as a workflow, not a prompt",
  "Apply policies, approved steps, and review gates before AI acts",
  "Keep runs traceable from input to output",
  "Publish proven workflows as internal tools or SaaS products"
];

export const valuePillars = [
  {
    title: "Model the workflow, not the prompt",
    copy:
      "Define inputs, reasoning steps, rules, and outputs for a real business task. LACE turns that design into a repeatable pipeline instead of a fragile prompt chain."
  },
  {
    title: "Policy-governed AI",
    copy:
      "Wrap every run in constraints around approved workflows, data handling, budget limits, model usage, and authority levels."
  },
  {
    title: "Deterministic execution",
    copy:
      "Same inputs, same process, inspectable steps. The model contributes reasoning power, but the platform controls how work is performed and accepted."
  },
  {
    title: "Built For Long Documents",
    copy:
      "From proposal volumes to technical plans, LACE handles large artifacts without losing the thread."
  },
  {
    title: "Grounded, Verifiable Output",
    copy:
      "LACE is designed to reduce hallucinations by grounding writing in your real source documents, checking claims against available evidence, and producing citation-ready sections for review."
  },
  {
    title: "From Workflow To Product",
    copy:
      "Once a workflow proves itself, LACE can package it as a reusable internal tool or a standalone customer-facing application."
  }
];

export const workflowSteps = [
  {
    step: "01",
    title: "Define the business use case",
    description:
      "Choose the task, the inputs it should use, the outputs it must produce, and the conditions that make the result acceptable."
  },
  {
    step: "02",
    title: "Set rules and constraints",
    description:
      "Attach policies, approved sources, allowed actions, and review requirements before the model ever runs."
  },
  {
    step: "03",
    title: "Run the workflow as a pipeline",
    description:
      "LACE executes the workflow step by step, letting AI reason inside a defined path instead of improvising across a chat thread."
  },
  {
    step: "04",
    title: "Supervise, review, and publish",
    description:
      "Observe the run, intervene when needed, and turn successful workflows into internal tools or standalone applications."
  }
];

export const operatingModes = [
  {
    badge: "POL",
    name: "Policy envelope",
    detail: "Set allowed models, budgets, data rules, and authority levels around a workflow."
  },
  {
    badge: "APP",
    name: "App publishing",
    detail: "Package a proven workflow as a standalone web application behind a URL."
  },
  {
    badge: "SUP",
    name: "Run supervision",
    detail: "Observe, recommend, pause, retry, or require human review when the process demands it."
  },
  {
    badge: "OPS",
    name: "Shared infrastructure",
    detail: "Reuse hosting, scaling, multi-tenancy, and controls across many AI products."
  }
];

export const useCases = [
  {
    id: "permit-research",
    tabTitle: "Permit Research",
    heading: "Permit and compliance research",
    summary:
      "Model a regulatory research workflow that can retrieve jurisdiction-specific rules, structure the answer, and keep outputs tied to source text.",
    documents: [
      "Municipal codes",
      "State regulations",
      "Permit guidance",
      "Agency source material"
    ],
    laceFit: [
      "Jurisdiction-aware retrieval",
      "Structured answers grounded in source text",
      "Reusable workflows for repeated requests",
      "Publishable internal or market-facing product"
    ]
  },
  {
    id: "proposals",
    tabTitle: "Proposal Generation",
    heading: "Government and healthcare proposal generation",
    summary:
      "Build a governed proposal workflow that can ingest requirements, align narrative across sections, and keep output grounded under review.",
    documents: [
      "RFP responses",
      "Technical and management volumes",
      "Compliance matrices",
      "Past performance narratives"
    ],
    laceFit: [
      "Source-grounded drafting",
      "Section-level regeneration without breaking the rest",
      "Consistent terminology across the full submission",
      "Review-ready output with traceable changes"
    ]
  },
  {
    id: "policy-updates",
    tabTitle: "Policy Updates",
    heading: "Enterprise policy and standards updates",
    summary:
      "Turn recurring standards updates into a controlled revision workflow with consistent language, policy checks, and review checkpoints.",
    documents: [
      "Internal policies",
      "Standards manuals",
      "Governance documents",
      "Update memos"
    ],
    laceFit: [
      "Controlled section updates",
      "Terminology consistency",
      "Review-friendly change records"
    ]
  },
  {
    id: "contracts",
    tabTitle: "Contract Drafting",
    heading: "Contract drafting and redlining",
    summary:
      "Create a clause-aware drafting and redlining workflow that applies approved language under business rules and preserves reviewability.",
    documents: ["NDAs", "MSAs", "Amendments", "Vendor contracts"],
    laceFit: [
      "Clause-level consistency",
      "Tracked revision logic",
      "Faster first-pass drafting"
    ]
  },
  {
    id: "ontology",
    tabTitle: "Ontology Construction",
    heading: "Ontology and knowledge structure generation",
    summary:
      "Stand up a structured knowledge-generation workflow for defense and intelligence programs that need repeatability, traceability, and control.",
    documents: [
      "Taxonomies",
      "Research corpora",
      "Technical reference sets",
      "Domain source collections"
    ],
    laceFit: [
      "Long-context source handling",
      "Structured output pipelines",
      "Repeatable knowledge generation workflows"
    ]
  }
];

export const assuranceTags = [
  "Control Plane",
  "Human Review",
  "Budget Caps",
  "Allowed Pipelines",
  "On-Prem"
];

export const trustItems = [
  "Every run can be wrapped in a control plane for model, budget, data, and authority policies",
  "AI output is treated as a proposal inside a defined acceptance path, not final truth",
  "Human checkpoints can be required for sensitive actions or final approval",
  "Inputs, steps, outputs, and interventions stay traceable",
  "The goal is AI you can audit, not AI that is usually right"
];

export const deploymentOptions = [
  "Publish a workflow as an internal tool behind a URL",
  "Launch standalone LACE apps on shared infrastructure",
  "Deploy in private cloud, on-prem, or air-gapped environments",
  "Support provider flexibility, scaling, and multi-tenancy at the platform layer",
  "Use the same foundation for SaaS products and custom enterprise delivery"
];
