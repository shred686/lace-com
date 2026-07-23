export interface ServiceSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServicePage {
  slug: string;
  shortName: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  lede: string;
  serviceType: string;
  sections: ServiceSection[];
  faqs: ServiceFaq[];
}

export const services: ServicePage[] = [
  {
    slug: "ai-agent-development",
    shortName: "AI Agent Development",
    eyebrow: "Enterprise AI agent development",
    title: "Enterprise AI agents that can safely do real work.",
    seoTitle: "Enterprise AI Agent Development | Determinant Systems",
    description:
      "Design and deploy governed enterprise AI agents with approved tools, company data, human approval gates, budgets, evaluations, and complete audit trails.",
    lede:
      "We design, build, and deploy AI agents that research, draft, process requests, and operate business tools within explicit company policy. Every capability is permissioned, every sensitive action can wait for approval, and every run leaves a record your team can inspect.",
    serviceType: "Enterprise AI agent design, development, and deployment",
    sections: [
      {
        heading: "From conversational assistant to governed operator",
        paragraphs: [
          "A useful enterprise agent needs more than a model and a system prompt. It needs an identity, a defined job, approved sources, a limited set of tools, escalation rules, cost limits, and a reliable execution record. We turn those requirements into an agent system that can operate inside the software your team already uses.",
          "Agents can work across web chat, email, Slack, Microsoft Teams, SMS, WhatsApp, and voice while sharing the same policies and organizational knowledge. The channel changes; the permissions, evidence, and approval path do not.",
        ],
      },
      {
        heading: "What an enterprise agent engagement can include",
        bullets: [
          "Role and task design based on a real recurring business process",
          "Connections to enterprise search, retrieval systems, knowledge graphs, APIs, and internal tools",
          "Explicit tool and data permissions for each agent role",
          "Human approval gates for financial, legal, customer-facing, or irreversible actions",
          "Evaluation scenarios that test quality, policy compliance, and failure behavior before launch",
          "Production monitoring for cost, quality, latency, and agent behavior",
        ],
      },
      {
        heading: "Governance is part of the runtime",
        paragraphs: [
          "Prompt instructions are not a security boundary. We enforce budgets, allowed actions, data access, and approval requirements in the system around the model. If an agent is not authorized to use a tool or reach a source, that capability is unavailable rather than merely discouraged.",
          "Execution traces show what the agent read, which tools it called, what it produced, and where a person intervened. Interrupted work can resume from recorded steps instead of disappearing into an opaque chat session.",
        ],
      },
      {
        heading: "Start with one job that has a measurable finish line",
        paragraphs: [
          "The strongest first agent is narrow enough to evaluate and valuable enough to matter: contract intake, invoice matching, customer follow-up, policy questions, proposal research, or request triage. We define success and unacceptable behavior before building, run the agent on representative work, then expand its authority only when the evidence supports it.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is an enterprise AI agent?",
        a: "An enterprise AI agent is a software worker that can reason over company context and take approved actions through business tools. Unlike a general chatbot, its data access, tools, budgets, escalation rules, and audit record are defined and enforced by the surrounding platform.",
      },
      {
        q: "Can an AI agent require human approval before acting?",
        a: "Yes. Approval gates can be attached to specific tools or decisions, so sensitive actions pause for an authorized person while low-risk steps continue automatically.",
      },
      {
        q: "Where can the agents be deployed?",
        a: "Agents can be exposed through web chat, email, Slack, Microsoft Teams, SMS, WhatsApp, and voice. The platform itself can run in managed cloud, private cloud, on-premises, or air-gapped environments.",
      },
      {
        q: "How do you test an AI agent before production?",
        a: "We define representative tasks, expected outcomes, policy constraints, and known failure cases, then score the agent against those scenarios. Tool permissions and approval paths are also tested before authority is expanded.",
      },
    ],
  },
  {
    slug: "custom-ai-application-development",
    shortName: "Custom AI Applications",
    eyebrow: "Custom AI application development",
    title: "AI applications built around the way your team actually works.",
    seoTitle: "Custom AI Application Development | Determinant Systems",
    description:
      "Custom enterprise AI application development with secure identity, governed data access, workflow automation, audit trails, deployment, and production support.",
    lede:
      "We build production applications for the process that never fit an off-the-shelf tool: the intake tracker, review workspace, knowledge assistant, approvals dashboard, or customer-facing AI product your team can describe but cannot buy.",
    serviceType: "Custom enterprise AI application design and development",
    sections: [
      {
        heading: "Purpose-built software without rebuilding the enterprise plumbing",
        paragraphs: [
          "Most custom application budgets disappear into infrastructure that every system needs: authentication, authorization, data storage, audit, deployment, and operations. We build on a governed application platform so the engagement can focus on your workflow, data model, interface, and acceptance criteria.",
          "The result is real software with sign-in, roles, structured data, versioned releases, hosting, and rollback—not a prototype that must be rewritten before anyone can depend on it.",
        ],
      },
      {
        heading: "What we can build",
        bullets: [
          "Internal operations tools for intake, review, approvals, and reporting",
          "Evidence-grounded assistants over company documents and databases",
          "AI-enabled customer portals and industry-specific SaaS products",
          "Workflow applications that coordinate people, models, and existing systems",
          "Analyst workbenches for document comparison, extraction, and knowledge review",
          "Apps that incorporate governed agents without exposing raw infrastructure",
        ],
      },
      {
        heading: "Generated speed, engineered boundaries",
        paragraphs: [
          "AI can accelerate interface and workflow development, but generated code should not invent its own authentication, permissions, persistence, or audit model. Those enterprise concerns stay behind a governed SDK and runtime. Application code receives narrow capabilities instead of database credentials or unrestricted network access.",
          "This architecture makes iteration fast where visual feedback works well while keeping identity, policy, and data handling consistent across every application.",
        ],
      },
      {
        heading: "A clear path from pilot to operated product",
        paragraphs: [
          "We begin with the smallest complete workflow that proves value on representative data. From there, we add integrations, roles, scale, and deployment controls in measured stages. Applications can run in the cloud or inside your infrastructure, and the same release history supports review, rollback, and handoff to your developers.",
        ],
      },
    ],
    faqs: [
      {
        q: "What makes a custom AI application different from a chatbot?",
        a: "A custom AI application combines an interface, structured data, business rules, workflow state, integrations, and governed AI capabilities. It is designed to complete a business process rather than only hold a conversation.",
      },
      {
        q: "Can our developers maintain the application?",
        a: "Yes. Applications are versioned software built against a public platform SDK. Teams can use local development, review generated or hand-written code, and manage releases through the same governed deployment path.",
      },
      {
        q: "Can you build a customer-facing AI product?",
        a: "Yes. The platform supports customer-facing applications as well as internal tools, including identity, hosting, data services, versioned releases, and subscription or billing infrastructure when required.",
      },
      {
        q: "Where is application data stored?",
        a: "The deployment model determines the boundary. LACE can run as managed cloud, in a private VPC, on-premises, or air-gapped so application data remains in the environment your organization approves.",
      },
    ],
  },
  {
    slug: "ai-workflow-automation",
    shortName: "AI Workflow Automation",
    eyebrow: "Enterprise AI workflow automation",
    title: "Turn a recurring business process into a governed AI workflow.",
    seoTitle: "Enterprise AI Workflow Automation | Determinant Systems",
    description:
      "Automate document-heavy enterprise workflows with defined AI steps, validations, approvals, system integrations, provenance, and a complete execution history.",
    lede:
      "We model the work your team performs across inboxes, documents, systems, and approvals, then build a repeatable AI workflow with explicit inputs, outputs, checks, and escalation paths at every step.",
    serviceType: "Enterprise AI workflow automation and orchestration",
    sections: [
      {
        heading: "Automate the process, not an isolated prompt",
        paragraphs: [
          "A prompt can draft an answer; a workflow gets a job to done. We decompose the process into observable stages—ingest, classify, retrieve, extract, reason, draft, validate, approve, and apply—then decide where AI contributes and where deterministic software or a person must remain in control.",
          "Each stage has a defined contract. Work only advances when the output satisfies its checks, which keeps one weak model response from silently contaminating everything downstream.",
        ],
      },
      {
        heading: "Common workflow automation patterns",
        bullets: [
          "Request intake, classification, routing, and response drafting",
          "Document review, evidence extraction, comparison, and exception handling",
          "Proposal and report generation with source grounding and approval",
          "Contract, policy, and compliance workflows with required review gates",
          "CRM, ticketing, email, file-store, and database updates after validation",
          "Long-running processes that resume safely after interruption",
        ],
      },
      {
        heading: "Controls that survive production",
        paragraphs: [
          "The workflow records the input, model and tool activity, validation results, approvals, and final output for every run. Policies can constrain which sources, models, budgets, and actions are allowed for a specific process or team.",
          "When a result is uncertain or a policy condition is not met, the process can retry, pause, route to a specialist, or refuse to proceed. That behavior is part of the workflow definition, not an improvised model response.",
        ],
      },
      {
        heading: "Measure the work before and after automation",
        paragraphs: [
          "We select a first process with recognizable inputs and an outcome the business can evaluate. The pilot uses real examples and captures the quality, exceptions, elapsed time, and human effort needed to complete the work. Those observations determine whether to expand, revise, or stop—before the organization commits to a broad transformation program.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is an AI workflow?",
        a: "An AI workflow is a defined sequence of software, model, tool, and human steps that completes a business task. Each stage has known inputs, outputs, policies, and acceptance conditions.",
      },
      {
        q: "Can the workflow connect to systems we already use?",
        a: "Yes. Workflows can integrate with email, CRMs, ticketing tools, document stores, collaboration platforms, databases, and internal APIs while preserving the access rules those systems require.",
      },
      {
        q: "What happens when the AI produces a weak answer?",
        a: "The workflow can validate the output, retrieve more evidence, retry within limits, route the work to a person, or stop. The result does not have to advance simply because a model produced it.",
      },
      {
        q: "Do we need to automate the entire process at once?",
        a: "No. A strong first implementation targets one repeatable segment with measurable value. Human checkpoints can remain anywhere uncertainty, policy, or business judgment makes full automation inappropriate.",
      },
    ],
  },
  {
    slug: "retrieval-augmented-generation",
    shortName: "RAG Systems",
    eyebrow: "Enterprise retrieval-augmented generation",
    title: "RAG systems that answer from evidence, not model memory.",
    seoTitle: "Enterprise RAG Development & Consulting | Determinant Systems",
    description:
      "Enterprise RAG development for complex documents, tables, citations, permissions, hybrid retrieval, evaluations, and deployable knowledge assistants.",
    lede:
      "We design retrieval-augmented generation systems that preserve document structure, enforce source permissions, and connect every material claim to evidence a reviewer can open.",
    serviceType: "Enterprise retrieval-augmented generation consulting and development",
    sections: [
      {
        heading: "Retrieval quality determines answer quality",
        paragraphs: [
          "A language model cannot answer accurately from evidence it never received. Production RAG begins with ingestion that understands pages, sections, tables, figures, metadata, and document relationships—not indiscriminate chunks of extracted text.",
          "We combine semantic and exact retrieval so meaning-based questions work without sacrificing names, identifiers, clauses, or numbers. Ranking, context assembly, and citation generation are evaluated as separate stages so failure can be located and improved.",
        ],
      },
      {
        heading: "What an enterprise RAG system needs",
        bullets: [
          "Connectors and synchronization for the repositories that hold authoritative content",
          "Layout-aware parsing for long documents, tables, figures, and section hierarchy",
          "Hybrid semantic and keyword retrieval with query-aware ranking",
          "Permission filtering before evidence reaches the model",
          "Page- and passage-level citations that users can verify",
          "Evaluation sets for retrieval recall, answer support, refusal, and citation accuracy",
        ],
      },
      {
        heading: "A supported refusal is better than a confident guess",
        paragraphs: [
          "The system should distinguish between an answer supported by the available corpus and one the evidence cannot establish. We design thresholds, validation, and response behavior so “the sources do not answer this” remains an acceptable outcome.",
          "For regulated or high-stakes work, retrieved passages, answer claims, model activity, and user access can remain linked in the run record. Reviewers can inspect not only the final response but the evidence path that produced it.",
        ],
      },
      {
        heading: "From RAG prototype to enterprise knowledge layer",
        paragraphs: [
          "We can improve an existing retrieval system or build the full path from ingestion to application. The same foundation can support enterprise search, grounded agents, document analysis, and knowledge graph extraction, which prevents every AI project from creating a separate copy of the company corpus.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is retrieval-augmented generation (RAG)?",
        a: "RAG retrieves relevant evidence from approved sources before a language model writes an answer. This lets the response use private or current organizational knowledge and cite the material that supports it.",
      },
      {
        q: "Can RAG understand tables and long documents?",
        a: "Yes, when ingestion preserves structure instead of flattening every file into plain text. We retain document hierarchy and table context so retrieval can return the relevant cell, section, and surrounding evidence.",
      },
      {
        q: "How do you prevent users from retrieving restricted content?",
        a: "Source-system identities and access rules are applied during retrieval. Evidence a user cannot access should be filtered before it is included in results or sent to a model.",
      },
      {
        q: "How is a RAG system evaluated?",
        a: "Evaluation separates retrieval from generation. We test whether the right evidence was found, whether the answer is supported by that evidence, whether citations resolve correctly, and whether the system refuses unsupported questions.",
      },
    ],
  },
  {
    slug: "enterprise-search",
    shortName: "Enterprise Search",
    eyebrow: "Enterprise search consulting and implementation",
    title: "One permissions-aware search across company knowledge.",
    seoTitle: "Enterprise Search Consulting & Implementation | Determinant Systems",
    description:
      "Enterprise search implementation across SharePoint, Drive, Slack, email, databases, and more with hybrid retrieval, cited answers, and source permissions.",
    lede:
      "We connect the repositories where your organization already keeps information and create a unified search and answer layer that understands meaning, respects source permissions, and shows the exact evidence behind every response.",
    serviceType: "Enterprise search consulting, integration, and implementation",
    sections: [
      {
        heading: "Search the enterprise without pretending it is one database",
        paragraphs: [
          "Company knowledge is fragmented across document libraries, collaboration tools, shared drives, databases, email, and legacy indexes. A useful enterprise search layer must reconcile different content structures, update schedules, identities, and permission models without erasing the boundaries that protect the source systems.",
          "We build continuously synchronized indexes where data can move and federated discovery where it cannot. Users get one query surface while each result retains its source, access rules, and route back to the authoritative record.",
        ],
      },
      {
        heading: "Core enterprise search capabilities",
        bullets: [
          "Connectors for SharePoint, Google Drive, OneDrive, Slack, email, S3, databases, websites, and existing indexes",
          "Hybrid retrieval for natural-language concepts, exact terms, numbers, names, and identifiers",
          "Permissions checked at query time and synchronized when source access changes",
          "Cited answers that open the relevant passage instead of returning an unexplained summary",
          "Federated discovery across divisions, partners, or enclaves without unnecessary data movement",
          "Usage, quality, and failed-query analysis to improve coverage after launch",
        ],
      },
      {
        heading: "Answers and search results share the same evidence layer",
        paragraphs: [
          "Some questions need a ranked list of documents; others need a direct synthesis across several sources. We support both on the same retrieval foundation. The answer cites its passages, and users can fall back to the underlying results whenever the source context matters more than a summary.",
          "This knowledge layer can also ground AI agents and applications, reducing duplicated ingestion and inconsistent permission behavior across separate projects.",
        ],
      },
      {
        heading: "Begin with the questions the organization cannot answer today",
        paragraphs: [
          "A pilot should include representative repositories, real access groups, and a question set drawn from actual work. We measure whether the correct source was available, found, permissioned, and cited. That makes coverage gaps visible before the system expands to additional business units or corpora.",
        ],
      },
    ],
    faqs: [
      {
        q: "What systems can enterprise search connect to?",
        a: "Common sources include SharePoint, Google Drive, OneDrive, Dropbox, Notion, Slack, email, Amazon S3, databases, websites, and existing search indexes. Custom connectors can be added for internal systems.",
      },
      {
        q: "Does enterprise search copy all of our data?",
        a: "Not necessarily. Some sources can be synchronized into an approved index, while federated discovery can query other boundaries without moving the underlying documents. The design depends on security and operational requirements.",
      },
      {
        q: "How are document permissions enforced?",
        a: "The search layer carries source identities and access controls into retrieval and checks them for each query. A result should not appear to someone who cannot open it in the authoritative system.",
      },
      {
        q: "What is the difference between enterprise search and RAG?",
        a: "Enterprise search finds and ranks relevant company information. RAG uses retrieved evidence as context for a language model to compose an answer. A mature system often provides both over one permission-aware retrieval layer.",
      },
    ],
  },
  {
    slug: "knowledge-graphs",
    shortName: "Enterprise Knowledge Graphs",
    eyebrow: "Enterprise knowledge graph development",
    title: "Turn documents into a queryable map of facts and relationships.",
    seoTitle: "Enterprise Knowledge Graph Development | Determinant Systems",
    description:
      "Enterprise knowledge graph consulting and development with evidence-linked facts, ontology design, entity resolution, temporal history, and human review.",
    lede:
      "We build governed knowledge graphs that extract people, organizations, agreements, obligations, events, and relationships from enterprise sources—while keeping every assertion connected to the passage that supports it.",
    serviceType: "Enterprise knowledge graph consulting and development",
    sections: [
      {
        heading: "A knowledge graph should explain where each fact came from",
        paragraphs: [
          "Graph extraction is only the beginning. Enterprise users need to know which document supports an assertion, when it was valid, when the system learned it, whether a reviewer approved it, and what happened when sources disagreed.",
          "We treat extracted facts as candidates that pass through schema validation, grounding, confidence checks, and review before materialization. The graph becomes a navigable evidence layer rather than an untraceable collection of AI guesses.",
        ],
      },
      {
        heading: "Knowledge graph capabilities",
        bullets: [
          "Ontology and schema design for the questions the business needs to answer",
          "Document-to-graph extraction with passage-level evidence",
          "Entity resolution that merges duplicates reversibly and auditably",
          "Temporal modeling for what was true and when the organization knew it",
          "Conflict detection when sources disagree on dates, amounts, identities, or obligations",
          "Human review queues for low-confidence, sensitive, or contradictory assertions",
        ],
      },
      {
        heading: "Standards where interoperability and assurance matter",
        paragraphs: [
          "For federal, defense, and intelligence programs, graph design can align to Basic Formal Ontology and Common Core Ontologies. Versioned schema packs define classes, relations, identity rules, and validation so conformance can be reviewed as an artifact rather than asserted in a slide.",
          "For commercial use cases, the same discipline supports contract intelligence, obligation tracking, regulatory analysis, customer and vendor views, and research over filings or internal reports.",
        ],
      },
      {
        heading: "Build from the decisions the graph must support",
        paragraphs: [
          "We start with a bounded set of questions, source documents, entity types, and review roles. A pilot proves extraction quality, identity rules, evidence navigation, and conflict behavior before the ontology expands. Search, agents, and applications can then consume the approved graph through the same governed platform.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is an enterprise knowledge graph?",
        a: "An enterprise knowledge graph represents business entities and their relationships in a queryable structure. It can connect information across documents and systems while retaining evidence, provenance, permissions, and temporal history.",
      },
      {
        q: "Can a knowledge graph be built automatically from documents?",
        a: "AI can propose entities, relationships, and values from documents, but production materialization should include schema validation, evidence grounding, confidence rules, and human review for uncertain or sensitive assertions.",
      },
      {
        q: "How are duplicate entities handled?",
        a: "Entity resolution compares names, identifiers, context, and relationships to propose merges. Decisions should remain reversible and recorded so users can understand why records were combined or kept separate.",
      },
      {
        q: "What does bitemporal mean in a knowledge graph?",
        a: "Bitemporal data tracks both when a fact was valid in the world and when the system learned or recorded it. This supports point-in-time questions without rewriting history when corrections arrive.",
      },
    ],
  },
];

export const getService = (slug: string) => services.find((service) => service.slug === slug);
