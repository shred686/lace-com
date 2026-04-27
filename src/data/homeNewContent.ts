export type HomeLocale = "es" | "en";

interface ValuePillar {
  title: string;
  copy: string;
}

interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

interface OperatingMode {
  badge: string;
  name: string;
  detail: string;
}

interface Capability {
  icon: string;
  title: string;
  body: string;
}

interface UseCase {
  id: string;
  tabTitle: string;
  heading: string;
  tagline: string;
  summary: string;
  detail: string;
  documents: string[];
  output: string;
}

interface HomeNewContent {
  capabilityTags: string[];
  valuePillars: ValuePillar[];
  workflowSteps: WorkflowStep[];
  capabilities: Capability[];
  operatingModes: OperatingMode[];
  useCases: UseCase[];
  assuranceTags: string[];
  trustItems: string[];
  deploymentOptions: string[];
}

const en: HomeNewContent = {
  capabilityTags: [
    "Enterprise AI",
    "Workflow Modeling",
    "Deterministic Pipelines",
    "Policy Controls",
    "Run Supervision",
    "App Publishing"
  ],
  valuePillars: [
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
  ],
  workflowSteps: [
    {
      step: "01",
      title: "Define the workflow",
      description:
        "Describe what the process does: what information goes in, what decisions get made, what the output looks like. LACE turns that into a structured pipeline — not a prompt, a real repeatable system."
    },
    {
      step: "02",
      title: "Set the rules",
      description:
        "Attach the guardrails: which data sources are approved, what language is required, what budget limits apply, which actions need human sign-off before they proceed. Rules travel with the pipeline, every run."
    },
    {
      step: "03",
      title: "Run it — step by step",
      description:
        "LACE executes the workflow in order. The AI reasons and generates inside each step, but the output is treated as a proposal — it doesn't become real until it passes your defined checks. No step can skip ahead."
    },
    {
      step: "04",
      title: "Review, improve, and deploy",
      description:
        "Inspect any run, trace any output back to its source, require human approval at key moments. Once a workflow proves itself, publish it as an internal tool or a full customer-facing application — without writing new infrastructure."
    }
  ],
  capabilities: [
    {
      icon: "→",
      title: "Deterministic pipelines",
      body: "Same inputs, same process, inspectable steps — every time. LACE doesn't improvise. Each run follows the exact sequence you defined, with enforced outputs at every stage. When something goes wrong, you know exactly where and why."
    },
    {
      icon: "◻",
      title: "Policy-governed execution",
      body: "Every pipeline runs inside a policy envelope: approved data sources, model constraints, token budgets, authority levels, and human review gates. Policies are set by your team and enforced by the platform — not honored by the AI on good behavior."
    },
    {
      icon: "⊕",
      title: "AI as a proposal engine",
      body: "AI generates content — the platform decides whether it's accepted. Nothing the AI produces touches your final document without passing validation checks for accuracy, evidence grounding, and policy compliance. The model suggests. LACE approves."
    },
    {
      icon: "◈",
      title: "Full provenance, every output",
      body: "Every sentence in a LACE output can be traced to the source it came from, the constraint that shaped it, and the step that produced it. If an auditor asks where a claim came from, you have the answer — down to the page and paragraph."
    },
    {
      icon: "⋯",
      title: "Built for large, complex documents",
      body: "Most AI tools lose coherence on long documents. LACE was built for them. It ingests and organizes large source files, selects the most relevant material for each step, and maintains consistency across a full document from first section to last."
    },
    {
      icon: "⬡",
      title: "From workflow to published product",
      body: "Once a workflow proves itself, LACE can package it as a standalone application — complete with user management, billing, and hosting. You bring the domain knowledge; the platform handles the infrastructure of turning it into software."
    }
  ],
  operatingModes: [
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
  ],
  useCases: [
    {
      id: "proposals",
      tabTitle: "Proposals & Bids",
      heading: "Proposals & Bids",
      tagline: "Writing proposals that actually win — without the scramble.",
      summary:
        "Build a governed proposal workflow that can ingest requirements, align narrative across sections, and keep output grounded under review.",
      detail:
        "Proposal teams spend most of their time formatting, cross-referencing, and rewriting content that already exists somewhere. LACE ingests your source materials — prior proposals, technical specs, compliance requirements — and generates sections that are grounded in real evidence, aligned to the evaluation criteria, and consistent across a hundred-page document. The team reviews and approves. The platform handles the rest.",
      documents: [
        "RFP or solicitation document",
        "Past performance write-ups and project records",
        "Technical specifications and approved cost structures",
        "Compliance and certification requirements"
      ],
      output:
        "A fully drafted, section-by-section proposal where every claim links to a source, every section meets the stated requirements, and the team can see exactly what AI contributed versus what they wrote themselves."
    },
    {
      id: "regulatory-compliance",
      tabTitle: "Regulatory & Compliance",
      heading: "Regulatory & Compliance",
      tagline: "Answering compliance questions without the research burden.",
      summary:
        "Model a regulatory research workflow that can retrieve jurisdiction-specific rules, structure the answer, and keep outputs tied to source text.",
      detail:
        'Every time a client or internal team asks "does this meet the regulation?" someone has to find the regulation, read it, and write the answer. LACE turns that recurring research task into a governed workflow: pull the relevant code or guidance, extract what applies, structure the answer, and cite the source. The same workflow runs for every jurisdiction, every time — not each analyst\'s personal approach.',
      documents: [
        "Municipal codes, state regulations, federal guidance",
        "Agency interpretations and enforcement precedents",
        "Client project details or permit applications"
      ],
      output:
        "Structured compliance summaries grounded in current source text — not the analyst's memory of what the regulation said six months ago. Repeatable for every new project, every new jurisdiction."
    },
    {
      id: "contracts",
      tabTitle: "Legal & Contract Work",
      heading: "Legal & Contract Work",
      tagline: "Drafting and reviewing contracts with rules that actually hold.",
      summary:
        "Create a clause-aware drafting and redlining workflow that applies approved language under business rules and preserves reviewability.",
      detail:
        "Legal teams know exactly what approved language looks like — the problem is applying it consistently across dozens of contracts a week. LACE runs a governed drafting workflow: apply approved clause libraries, flag deviations from standard terms, highlight anything that requires attorney review, and produce a clean redline with every change documented. What used to take a paralegal a day takes an hour.",
      documents: [
        "Approved clause library and fallback positions",
        "Counterparty draft to review or redline",
        "Deal-specific parameters (term, jurisdiction, parties)"
      ],
      output:
        "A first-pass contract with approved language applied, deviations flagged, and attorney attention directed to the items that actually need it — not formatting or boilerplate."
    },
    {
      id: "policy-updates",
      tabTitle: "Policy & Standards",
      heading: "Policy & Standards",
      tagline: "Keeping policy documents current when regulations change.",
      summary:
        "Turn recurring standards updates into a controlled revision workflow with consistent language, policy checks, and review checkpoints.",
      detail:
        "When a regulation updates, every policy that references it needs to be reviewed and potentially revised. In large organizations, this is a multi-week project of finding the affected policies, drafting revisions, getting approvals, and distributing the changes. LACE turns it into a controlled workflow: identify affected sections, generate proposed language, run the revision through a review gate, and produce a tracked-changes document for final approval.",
      documents: [
        "Existing policy library",
        "New or amended regulation text",
        "Approved terminology and house style guidelines"
      ],
      output:
        "A policy revision workflow that surfaces what needs to change, proposes specific edits in your organization's language, and routes to approvers — without starting from a blank document every time."
    },
    {
      id: "financial-analysis",
      tabTitle: "Financial Analysis",
      heading: "Financial Analysis",
      tagline: "Turning financial filings into structured intelligence.",
      summary:
        "Build a governed extraction workflow for earnings reports, filings, and financial data with full source citations.",
      detail:
        "Reading earnings reports, extracting the numbers that matter, comparing them across quarters and competitors — it's time-consuming, repetitive, and error-prone when done manually. LACE ingests financial documents, extracts structured data from tables and text, checks figures for internal consistency, and produces summaries where every number traces back to the source page and section. Analysts spend their time on interpretation, not extraction.",
      documents: [
        "Earnings reports, 10-Ks, annual filings",
        "Prior period documents for comparison",
        "Analyst question sets or specific data points to extract"
      ],
      output:
        "Structured financial summaries with full source citations — extracted from your actual documents, not recalled from a model's training data. Numbers you can verify in thirty seconds."
    },
    {
      id: "intelligence-defense",
      tabTitle: "Intelligence & Defense",
      heading: "Intelligence & Defense",
      tagline: "Building knowledge systems that hold up under scrutiny.",
      summary:
        "Stand up a structured knowledge-generation workflow for defense and intelligence programs that need repeatability, traceability, and control.",
      detail:
        "Defense and intelligence programs need AI that can run in restricted environments, maintain full audit trails, and produce outputs that analysts can actually verify — not trust on faith. LACE was designed for exactly this: air-gapped deployment, zero external API calls, on-premise model hosting, and a governance layer that logs every decision made during a run. Whether the task is ontology construction, document analysis, or large-scale knowledge extraction, the output comes with complete provenance.",
      documents: [
        "Classified or restricted source documents",
        "Existing knowledge bases or ontology frameworks",
        "Program-specific extraction and output requirements"
      ],
      output:
        "AI-assisted analysis and knowledge construction that operates entirely within your security boundary, with no data leaving your environment and a complete chain of custody on every output."
    }
  ],
  assuranceTags: ["Control Plane", "Human Review", "Budget Caps", "Allowed Pipelines", "On-Prem"],
  trustItems: [
    "Every run can be wrapped in a control plane for model, budget, data, and authority policies",
    "AI output is treated as a proposal inside a defined acceptance path, not final truth",
    "Human checkpoints can be required for sensitive actions or final approval",
    "Inputs, steps, outputs, and interventions stay traceable",
    "The goal is AI you can audit, not AI that is usually right"
  ],
  deploymentOptions: [
    "Publish a workflow as an internal tool behind a URL",
    "Launch standalone LACE apps on shared infrastructure",
    "Deploy in private cloud, on-prem, or air-gapped environments",
    "Support provider flexibility, scaling, and multi-tenancy at the platform layer",
    "Use the same foundation for SaaS products and custom enterprise delivery"
  ]
};

const es: HomeNewContent = {
  capabilityTags: [
    "Enterprise AI",
    "Workflow Modeling",
    "Deterministic Pipelines",
    "Policy Controls",
    "Run Supervision",
    "App Publishing"
  ],
  valuePillars: [
    {
      title: "Modela el workflow, no el prompt",
      copy:
        "Define inputs, pasos de razonamiento, reglas y outputs para una tarea real de negocio. LACE convierte ese diseño en un pipeline repetible en lugar de una prompt chain frágil."
    },
    {
      title: "AI gobernada por policy",
      copy:
        "Envuelve cada run en restricciones sobre approved workflows, manejo de datos, límites de presupuesto, uso de modelos y niveles de autoridad."
    },
    {
      title: "Ejecución determinista",
      copy:
        "Mismos inputs, mismo proceso, pasos inspeccionables. El modelo aporta reasoning power, pero la plataforma controla cómo se realiza y acepta el trabajo."
    },
    {
      title: "Diseñado para documentos largos",
      copy:
        "Desde volúmenes de propuesta hasta planes técnicos, LACE maneja artifacts extensos sin perder el hilo."
    },
    {
      title: "Output grounded y verificable",
      copy:
        "LACE está diseñado para reducir hallucinations al fundamentar la redacción en tus source documents reales, revisar claims contra la evidencia disponible y producir secciones citation-ready para revisión."
    },
    {
      title: "Del workflow al producto",
      copy:
        "Una vez que un workflow demuestra valor, LACE puede empaquetarlo como herramienta interna reutilizable o como aplicación independiente orientada al cliente."
    }
  ],
  workflowSteps: [
    {
      step: "01",
      title: "Define el workflow",
      description:
        "Describe qué hace el proceso: qué información entra, qué decisiones se toman, cómo se ve el output. LACE convierte eso en un pipeline estructurado — no un prompt, sino un sistema real y repetible."
    },
    {
      step: "02",
      title: "Establece las reglas",
      description:
        "Adjunta los guardrails: qué data sources están aprobadas, qué lenguaje se requiere, qué budget limits aplican, qué acciones necesitan human sign-off antes de continuar. Las reglas viajan con el pipeline, en cada run."
    },
    {
      step: "03",
      title: "Ejecútalo — paso a paso",
      description:
        "LACE ejecuta el workflow en orden. AI razona y genera dentro de cada paso, pero el output se trata como una propuesta — no se vuelve real hasta que pasa tus checks definidos. Ningún paso puede saltarse."
    },
    {
      step: "04",
      title: "Revisa, mejora y despliega",
      description:
        "Inspecciona cualquier run, rastrea cualquier output hasta su source y exige aprobación humana en momentos clave. Una vez que un workflow demuestra valor, publícalo como herramienta interna o como aplicación completa orientada al cliente — sin escribir nueva infraestructura."
    }
  ],
  capabilities: [
    {
      icon: "→",
      title: "Pipelines deterministas",
      body: "Mismos inputs, mismo proceso, pasos inspeccionables — siempre. LACE no improvisa. Cada run sigue la secuencia exacta que definiste, con outputs obligatorios en cada stage. Cuando algo falla, sabes exactamente dónde y por qué."
    },
    {
      icon: "◻",
      title: "Ejecución gobernada por policy",
      body: "Cada pipeline corre dentro de un policy envelope: approved data sources, model constraints, token budgets, authority levels y human review gates. Las policies las define tu equipo y las hace cumplir la plataforma, no AI por buen comportamiento."
    },
    {
      icon: "⊕",
      title: "AI como motor de propuestas",
      body: "AI genera contenido; la plataforma decide si se acepta. Nada de lo que produce AI toca tu documento final sin pasar validation checks de precisión, evidence grounding y policy compliance. El modelo sugiere. LACE aprueba."
    },
    {
      icon: "◈",
      title: "Full provenance, cada output",
      body: "Cada oración en un output de LACE puede rastrearse al source del que vino, la constraint que la moldeó y el step que la produjo. Si un auditor pregunta de dónde vino un claim, tienes la respuesta — hasta la página y el párrafo."
    },
    {
      icon: "⋯",
      title: "Diseñado para documentos grandes y complejos",
      body: "La mayoría de las herramientas de AI pierden coherencia en documentos largos. LACE fue construido para ellos. Ingiere y organiza source files extensos, selecciona el material más relevante para cada step y mantiene consistencia a lo largo de todo el documento."
    },
    {
      icon: "⬡",
      title: "Del workflow al producto publicado",
      body: "Una vez que un workflow demuestra valor, LACE puede empaquetarlo como standalone application — completa con user management, billing y hosting. Tú aportas el domain knowledge; la plataforma maneja la infraestructura para convertirlo en software."
    }
  ],
  operatingModes: [
    {
      badge: "POL",
      name: "Policy envelope",
      detail: "Define modelos permitidos, budgets, data rules y authority levels alrededor de un workflow."
    },
    {
      badge: "APP",
      name: "App publishing",
      detail: "Empaqueta un workflow probado como standalone web application detrás de una URL."
    },
    {
      badge: "SUP",
      name: "Run supervision",
      detail: "Observa, recomienda, pausa, reintenta o exige human review cuando el proceso lo requiere."
    },
    {
      badge: "OPS",
      name: "Infraestructura compartida",
      detail: "Reutiliza hosting, scaling, multi-tenancy y controles en muchos AI products."
    }
  ],
  useCases: [
    {
      id: "proposals",
      tabTitle: "Propuestas y Licitaciones",
      heading: "Propuestas y Licitaciones",
      tagline: "Redactar propuestas que ganan — sin el caos de último momento.",
      summary:
        "Construye un proposal workflow gobernado que puede ingerir requisitos, alinear la narrativa entre secciones y mantener el output grounded bajo revisión.",
      detail:
        "Los equipos de propuestas pasan la mayor parte del tiempo formateando, cruzando referencias y reescribiendo contenido que ya existe en algún lugar. LACE ingiere tus source materials — propuestas anteriores, technical specs, compliance requirements — y genera secciones grounded en evidencia real, alineadas con los evaluation criteria y consistentes en un documento de cien páginas. El equipo revisa y aprueba. La plataforma maneja el resto.",
      documents: [
        "RFP o solicitation document",
        "Past performance write-ups y registros de proyectos",
        "Technical specifications y estructuras de costo aprobadas",
        "Compliance and certification requirements"
      ],
      output:
        "Una propuesta completamente redactada, sección por sección, donde cada claim enlaza a un source, cada sección cumple los requisitos establecidos y el equipo puede ver exactamente qué aportó AI frente a lo que escribieron ellos."
    },
    {
      id: "regulatory-compliance",
      tabTitle: "Regulación y Cumplimiento",
      heading: "Regulación y Cumplimiento",
      tagline: "Responder compliance questions sin la carga de investigación.",
      summary:
        "Modela un regulatory research workflow que puede recuperar reglas específicas por jurisdicción, estructurar la respuesta y mantener outputs atados al source text.",
      detail:
        "Cada vez que un cliente o equipo interno pregunta \"¿esto cumple con la regulación?\" alguien tiene que encontrar la regulación, leerla y escribir la respuesta. LACE convierte esa tarea recurrente de research en un workflow gobernado: trae el code o guidance relevante, extrae lo que aplica, estructura la respuesta y cita el source. El mismo workflow corre para cada jurisdicción, cada vez — no el enfoque personal de cada analyst.",
      documents: [
        "Municipal codes, state regulations, federal guidance",
        "Agency interpretations y enforcement precedents",
        "Detalles de proyecto del cliente o permit applications"
      ],
      output:
        "Compliance summaries estructurados y grounded en source text actual — no en la memoria del analyst sobre lo que decía la regulación hace seis meses. Repetible para cada nuevo proyecto, cada nueva jurisdicción."
    },
    {
      id: "contracts",
      tabTitle: "Legal y Contratos",
      heading: "Legal y Contratos",
      tagline: "Redactar y revisar contratos con reglas que realmente se sostienen.",
      summary:
        "Crea un workflow de drafting y redlining clause-aware que aplica lenguaje aprobado bajo reglas de negocio y preserva reviewability.",
      detail:
        "Los equipos legales saben exactamente cómo se ve el lenguaje aprobado; el problema es aplicarlo de forma consistente en decenas de contratos por semana. LACE ejecuta un governed drafting workflow: aplica approved clause libraries, marca desviaciones de standard terms, resalta cualquier cosa que requiera attorney review y produce un redline limpio con cada cambio documentado. Lo que antes le tomaba un día a un paralegal toma una hora.",
      documents: [
        "Approved clause library y fallback positions",
        "Counterparty draft para revisar o redline",
        "Deal-specific parameters (term, jurisdiction, parties)"
      ],
      output:
        "Un first-pass contract con lenguaje aprobado aplicado, desviaciones marcadas y la atención del attorney dirigida a los elementos que realmente la necesitan — no al formato ni al boilerplate."
    },
    {
      id: "policy-updates",
      tabTitle: "Políticas y Estándares",
      heading: "Políticas y Estándares",
      tagline: "Mantener policy documents actualizados cuando cambian las regulaciones.",
      summary:
        "Convierte standards updates recurrentes en un controlled revision workflow con lenguaje consistente, policy checks y review checkpoints.",
      detail:
        "Cuando una regulación se actualiza, cada policy que la referencia necesita ser revisada y posiblemente modificada. En organizaciones grandes, esto es un proyecto de varias semanas: encontrar las policies afectadas, redactar revisiones, obtener approvals y distribuir los cambios. LACE lo convierte en un controlled workflow: identifica secciones afectadas, genera lenguaje propuesto, pasa la revisión por un review gate y produce un tracked-changes document para aprobación final.",
      documents: [
        "Existing policy library",
        "Texto de regulación nueva o enmendada",
        "Approved terminology y house style guidelines"
      ],
      output:
        "Un policy revision workflow que muestra qué necesita cambiar, propone edits específicos en el lenguaje de tu organización y enruta a approvers — sin empezar desde un documento en blanco cada vez."
    },
    {
      id: "financial-analysis",
      tabTitle: "Análisis Financiero",
      heading: "Análisis Financiero",
      tagline: "Convertir financial filings en inteligencia estructurada.",
      summary:
        "Construye un governed extraction workflow para earnings reports, filings y financial data con full source citations.",
      detail:
        "Leer earnings reports, extraer los números que importan, compararlos entre trimestres y competidores: toma tiempo, se repite y es propenso a errores cuando se hace manualmente. LACE ingiere documentos financieros, extrae structured data de tablas y texto, revisa las cifras por consistencia interna y produce summaries donde cada número se rastrea a la source page y section. Los analysts pasan su tiempo en interpretación, no en extraction.",
      documents: [
        "Earnings reports, 10-Ks, annual filings",
        "Documentos de periodos anteriores para comparación",
        "Analyst question sets o data points específicos a extraer"
      ],
      output:
        "Structured financial summaries con full source citations — extraídos de tus documentos reales, no recordados desde los training data de un modelo. Números que puedes verificar en treinta segundos."
    },
    {
      id: "intelligence-defense",
      tabTitle: "Inteligencia y Defensa",
      heading: "Inteligencia y Defensa",
      tagline: "Construir knowledge systems que resistan el escrutinio.",
      summary:
        "Levanta un structured knowledge-generation workflow para programas de defensa e inteligencia que necesitan repeatability, traceability y control.",
      detail:
        "Los programas de defensa e inteligencia necesitan AI que pueda operar en restricted environments, mantener full audit trails y producir outputs que los analysts puedan verificar de verdad — no confiar por fe. LACE fue diseñado exactamente para esto: air-gapped deployment, cero external API calls, on-premise model hosting y una governance layer que registra cada decisión tomada durante un run. Ya sea ontology construction, document analysis o large-scale knowledge extraction, el output viene con complete provenance.",
      documents: [
        "Documentos fuente clasificados o restringidos",
        "Existing knowledge bases u ontology frameworks",
        "Program-specific extraction and output requirements"
      ],
      output:
        "AI-assisted analysis y knowledge construction que opera completamente dentro de tu security boundary, sin datos saliendo de tu entorno y con complete chain of custody en cada output."
    }
  ],
  assuranceTags: [
    "Control Plane",
    "Human Review",
    "Budget Caps",
    "Allowed Pipelines",
    "On-Prem"
  ],
  trustItems: [
    "Cada run puede envolverse en un control plane para policies de modelo, presupuesto, datos y autoridad",
    "El AI output se trata como una propuesta dentro de una acceptance path definida, no como verdad final",
    "Se pueden exigir human checkpoints para acciones sensibles o aprobación final",
    "Inputs, steps, outputs e interventions permanecen traceable",
    "El objetivo es AI que puedes auditar, no AI que suele acertar"
  ],
  deploymentOptions: [
    "Publica un workflow como herramienta interna detrás de una URL",
    "Lanza standalone LACE apps sobre infraestructura compartida",
    "Despliega en private cloud, on-prem o air-gapped environments",
    "Soporta provider flexibility, scaling y multi-tenancy en la platform layer",
    "Usa la misma foundation para SaaS products y custom enterprise delivery"
  ]
};

const contentByLocale: Record<HomeLocale, HomeNewContent> = {
  es,
  en
};

export const getHomeNewContent = (locale: HomeLocale): HomeNewContent => {
  return contentByLocale[locale] ?? contentByLocale.es;
};
