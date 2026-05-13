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
    title: "Search And Retrieve What Matters",
    description:
      "LACE ingests your sources, chunks and embeds them, and enables smart vector search so teams can find meaning, not just keywords."
  },
  {
    step: "03",
    title: "Generate With Guardrails",
    description:
      "LACE builds and refines sections with your structure and goals in view, not as isolated chat answers."
  },
  {
    step: "04",
    title: "Review, Regenerate, Deliver",
    description:
      "Focus regeneration where needed, keep decisions traceable, and publish final deliverables with confidence."
  }
];

export const documentSources = [
  {
    id: "sharepoint",
    name: "SharePoint",
    badge: "SP",
    detail: "Microsoft 365 sites and document libraries"
  },
  {
    id: "google-drive",
    name: "Google Drive",
    badge: "GD",
    detail: "Shared drives, folders, and workspace docs"
  },
  {
    id: "onedrive",
    name: "OneDrive",
    badge: "OD",
    detail: "Personal and team files in Microsoft 365"
  },
  {
    id: "box",
    name: "Box",
    badge: "BX",
    detail: "Enterprise content and governance workspaces"
  },
  {
    id: "dropbox",
    name: "Dropbox",
    badge: "DB",
    detail: "Team repositories and synced project folders"
  }
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

export const useCases = [
  {
    id: "financial-filings",
    tabTitle: "Financial Regulatory Filings",
    heading: "Financial Regulatory Filings",
    documents: ["10-K / 10-Q", "S-1 filings", "Risk disclosures", "Prospectuses"],
    problems: [
      "Risk language must be extremely precise",
      "Changes in financial numbers cascade",
      "Legal review cycles cause section-level edits"
    ],
    laceFit: [
      "Conservative regeneration strategy",
      "Locked legal-approved blocks",
      "StyleAnchor for corporate legal tone",
      "CompetencySpec checks for specific risk coverage"
    ]
  },
  {
    id: "enterprise-policy",
    tabTitle: "Enterprise Policy Manuals",
    heading: "Enterprise Governance and Internal Corporate Documents",
    documents: [
      "Employee handbook",
      "InfoSec policy manual",
      "Corporate governance manual",
      "Code of Conduct"
    ],
    problems: [
      "Constant regulatory updates",
      "Cross-referenced sections",
      "Department-specific variants",
      "Terminology enforcement"
    ],
    laceFit: [
      "Terminology registry",
      "Node-level patching",
      "Organization-based StyleAnchor",
      "Multi-version compilation"
    ]
  },
  {
    id: "government-proposals",
    tabTitle: "Government Proposal Writing",
    heading: "Government Proposal Writing",
    documents: [
      "RFP responses",
      "Technical and management volumes",
      "Past performance narratives",
      "Compliance matrices"
    ],
    problems: [
      "Strict compliance requirements across many sections",
      "Late requirement clarifications force broad rewrites",
      "Cross-volume consistency is hard to maintain"
    ],
    laceFit: [
      "Compliance criteria as CompetencySpecs",
      "Win-theme and customer-specific StyleAnchors",
      "Section-level deterministic regeneration",
      "Traceable evidence and citation grounding"
    ]
  },
  {
    id: "legal-contracts",
    tabTitle: "Legal: Contract Drafting",
    heading: "Legal Department - Contract Drafting and Redlining",
    documents: [
      "NDAs",
      "MSAs",
      "Vendor contracts",
      "Employment agreements",
      "Amendments"
    ],
    problems: [
      "Teams manually redline and reconcile multiple versions",
      "Clause consistency drifts across contract families",
      "Revision rationale is hard to preserve"
    ],
    laceFit: [
      "Upload prior versions and generate clean revisions with tracked reasoning",
      "Deterministic clause-level updates",
      "Consistent legal language across templates"
    ]
  },
  {
    id: "hr-policy",
    tabTitle: "HR: Policy Updates",
    heading: "Human Resources - Policy Creation and Updates",
    documents: [
      "Employee handbooks",
      "Remote work policies",
      "DEI policies",
      "Code of conduct updates",
      "Benefits documentation"
    ],
    problems: [
      "HR teams copy old policies and edit Word documents manually",
      "Language becomes inconsistent across policy sets",
      "Regulatory updates must be reflected quickly"
    ],
    laceFit: [
      "Upload prior policies and regulatory updates for consistent revisions",
      "Legally aligned policy language across document families",
      "Section-level regeneration for targeted updates"
    ]
  },
  {
    id: "hr-job-architecture",
    tabTitle: "HR: Job Descriptions",
    heading: "Human Resources - Job Descriptions at Scale",
    documents: [
      "Standardized role descriptions",
      "Level differentiation (Junior / Senior / Director)",
      "Compensation band documentation",
      "Performance expectations"
    ],
    problems: [
      "Role definitions drift between departments",
      "Leveling and compensation language becomes inconsistent",
      "Hiring teams lose clarity across job families"
    ],
    laceFit: [
      "Standardized role architecture across teams",
      "Controlled terminology for level and competency definitions",
      "Cleaner documentation that reduces hiring and legal confusion"
    ]
  },
  {
    id: "hr-performance",
    tabTitle: "HR: Performance Reviews",
    heading: "Human Resources - Performance Review Templates",
    documents: [
      "Department-specific evaluation frameworks",
      "Leadership review summaries",
      "Promotion justification memos",
      "Succession planning documents"
    ],
    problems: [
      "Review criteria vary by manager and department",
      "Promotion documentation lacks consistency",
      "Succession records are hard to maintain at scale"
    ],
    laceFit: [
      "Reusable evaluation templates with consistent criteria",
      "Structured promotion and leadership memo generation",
      "Traceable updates across review cycles"
    ]
  },
  {
    id: "finance-reports",
    tabTitle: "Finacial Reports",
    heading: "Finance and Accounting - Quarterly and Annual Reports",
    documents: [
      "Management Discussion and Analysis (MD&A)",
      "Budget summaries",
      "Forecast explanations",
      "Investor updates"
    ],
    problems: [
      "Teams manually stitch spreadsheet outputs into narrative",
      "Data updates require broad document rewrites",
      "Tone and structure vary across reporting periods"
    ],
    laceFit: [
      "Data-aware narrative generation for recurring reporting cycles",
      "Patch-based updates when figures change",
      "Consistent executive and investor-ready style"
    ]
  },
  {
    id: "ops-sop",
    tabTitle: "Operations: SOPs",
    heading: "Operations - SOP (Standard Operating Procedure) Generation",
    documents: [
      "Process documentation",
      "Manufacturing workflows",
      "Customer onboarding processes",
      "IT service desk flows"
    ],
    problems: [
      "Process notes live in fragmented formats",
      "SOP formatting varies by team",
      "Audit readiness requires consistent standards"
    ],
    laceFit: [
      "Upload process notes and generate standardized audit-ready SOPs",
      "Terminology consistency across procedure sets",
      "Controlled section updates as workflows change"
    ]
  },
  {
    id: "ops-incident-reports",
    tabTitle: "Operations: Incidents",
    heading: "Operations - Incident Reports",
    documents: [
      "Security incident reports",
      "IT outage reports",
      "Workplace incident reports",
      "Root cause analyses"
    ],
    problems: [
      "Incident details arrive from many systems",
      "Post-incident narratives are inconsistent",
      "Traceability is required for follow-up actions"
    ],
    laceFit: [
      "Structured incident documentation from source evidence",
      "Consistent root-cause and remediation format",
      "Traceable updates across investigation stages"
    ]
  },
  {
    id: "ops-knowledge-base",
    tabTitle: "Operations: Knowledge Base",
    heading: "Operations - Internal Knowledge Base Creation",
    documents: [
      "Formalized meeting documentation",
      "Operational runbooks from Slack threads",
      "Process docs from email chains"
    ],
    problems: [
      "Key institutional knowledge stays trapped in chats and inboxes",
      "Documentation quality varies widely",
      "Teams struggle to maintain one reliable source"
    ],
    laceFit: [
      "Keep your Knowledge Base in sync with changing documentation, meeting minutes, etc",
      "Standardized knowledge article structure",
      "Transform unstructured information from documents, emails, messages into usable documentation"
    ]
  },
  {
    id: "sales-rfp",
    tabTitle: "Sales: Proposals and RFPs",
    heading: "Sales and Marketing - Proposal and RFP Responses",
    documents: [
      "Government RFP responses",
      "Enterprise procurement responses",
      "Partnership proposals"
    ],
    problems: [
      "RFP responses require fast, precise multi-section coordination",
      "Teams repeatedly rebuild the same narrative blocks",
      "Compliance and messaging consistency is difficult"
    ],
    laceFit: [
      "Reusable response components grounded in prior submissions",
      "Customer-specific and industry-specific style controls",
      "Deterministic section updates during proposal revisions"
    ]
  },
  {
    id: "sales-case-studies",
    tabTitle: "Sales: Case Studies",
    heading: "Sales and Marketing - Case Studies and White Papers",
    documents: [
      "Marketing case studies",
      "Thought leadership content",
      "Industry analysis papers"
    ],
    problems: [
      "Project evidence is hard to convert into polished narratives",
      "Brand and tone consistency can drift",
      "Long-form content cycles are slow"
    ],
    laceFit: [
      "Turn project documentation into publishable long-form assets",
      "StyleAnchors for brand-consistent voice",
      "Patch-based updates as new proof points arrive"
    ]
  },
  {
    id: "training-certification",
    tabTitle: "Training and Certification",
    heading: "Corporate Training and Certification Programs",
    documents: [
      "Multi-level training manuals",
      "Certification tracks",
      "Technical onboarding guides",
      "Cross-functional enablement playbooks"
    ],
    problems: [
      "Frequent section-level updates",
      "Terminology must stay consistent",
      "Cross-linked references break with edits",
      "Content must publish in multiple formats"
    ],
    laceFit: [
      "Section-level regeneration",
      "Terminology controls",
      "Reference integrity checks",
      "Multi-format export workflows"
    ]
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
