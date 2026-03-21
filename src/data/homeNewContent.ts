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
  heroProofs: string[];
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
  heroProofs: ["Model business workflows", "Policy-governed execution", "Deployable AI apps"],
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
  heroProofs: ["Modela flujos de negocio", "Ejecucion gobernada por politicas", "Apps de IA desplegables"],
  capabilityTags: [
    "IA Empresarial",
    "Modelado de Flujos",
    "Pipelines Deterministas",
    "Controles de Politica",
    "Supervision de Ejecucion",
    "Publicacion de Apps"
  ],
  valuePillars: [
    {
      title: "Modela el flujo, no el prompt",
      copy:
        "Define entradas, pasos de razonamiento, reglas y salidas para una tarea real. LACE convierte ese diseno en un pipeline repetible, no en una cadena fragil de prompts."
    },
    {
      title: "IA gobernada por politicas",
      copy:
        "Envuelve cada ejecucion con restricciones de flujos aprobados, manejo de datos, limites de presupuesto, uso de modelos y niveles de autorizacion."
    },
    {
      title: "Ejecucion determinista",
      copy:
        "Mismas entradas, mismo proceso, pasos inspeccionables. El modelo aporta razonamiento, pero la plataforma controla como se realiza y acepta el trabajo."
    },
    {
      title: "Construido para documentos largos",
      copy:
        "Desde propuestas tecnicas hasta planes complejos, LACE maneja artefactos extensos sin perder consistencia."
    },
    {
      title: "Salida fundamentada y verificable",
      copy:
        "LACE reduce alucinaciones al fundamentar redaccion en tus fuentes reales, validar afirmaciones contra evidencia disponible y generar secciones listas para cita y revision."
    },
    {
      title: "Del flujo al producto",
      copy:
        "Cuando un flujo demuestra valor, LACE puede empaquetarlo como herramienta interna reutilizable o aplicacion independiente para clientes."
    }
  ],
  workflowSteps: [
    {
      step: "01",
      title: "Define el flujo",
      description:
        "Describe lo que hace el proceso: que informacion entra, que decisiones se toman, como luce el resultado. LACE convierte eso en un pipeline estructurado — no un prompt, un sistema real y repetible."
    },
    {
      step: "02",
      title: "Establece las reglas",
      description:
        "Adjunta los controles: que fuentes de datos estan aprobadas, que lenguaje se requiere, que limites de presupuesto aplican, que acciones necesitan aprobacion humana antes de continuar. Las reglas viajan con el pipeline, en cada ejecucion."
    },
    {
      step: "03",
      title: "Ejecutalo — paso a paso",
      description:
        "LACE ejecuta el flujo en orden. La IA razona y genera dentro de cada paso, pero el resultado se trata como propuesta — no se vuelve real hasta que pasa tus verificaciones definidas. Ningun paso puede saltarse."
    },
    {
      step: "04",
      title: "Revisa, mejora y despliega",
      description:
        "Inspecciona cualquier ejecucion, traza cualquier resultado a su fuente, exige aprobacion humana en momentos clave. Una vez que un flujo se prueba, publicalcomo herramienta interna o aplicacion para clientes — sin escribir nueva infraestructura."
    }
  ],
  capabilities: [
    {
      icon: "→",
      title: "Pipelines deterministas",
      body: "Mismas entradas, mismo proceso, pasos inspeccionables — siempre. LACE no improvisa. Cada ejecucion sigue la secuencia exacta que definiste, con salidas forzadas en cada etapa. Cuando algo falla, sabes exactamente donde y por que."
    },
    {
      icon: "◻",
      title: "Ejecucion gobernada por politicas",
      body: "Cada pipeline corre dentro de un envolvente de politica: fuentes de datos aprobadas, restricciones de modelo, presupuestos de tokens, niveles de autoridad y puertas de revision humana. Las politicas las define tu equipo y las hace cumplir la plataforma."
    },
    {
      icon: "⊕",
      title: "IA como motor de propuestas",
      body: "La IA genera contenido — la plataforma decide si se acepta. Nada de lo que produce la IA toca tu documento final sin pasar verificaciones de precision, fundamento en evidencia y cumplimiento de politica. El modelo sugiere. LACE aprueba."
    },
    {
      icon: "◈",
      title: "Proveniencia completa en cada salida",
      body: "Cada oracion en una salida de LACE puede rastrearse a la fuente de origen, la restriccion que la moldeo y el paso que la produjo. Si un auditor pregunta de donde vino una afirmacion, tienes la respuesta — hasta la pagina y el parrafo."
    },
    {
      icon: "⋯",
      title: "Construido para documentos grandes y complejos",
      body: "La mayoria de herramientas de IA pierden coherencia en documentos largos. LACE fue construido para ellos. Ingiere y organiza archivos de gran tamano, selecciona el material mas relevante para cada paso y mantiene consistencia en todo el documento."
    },
    {
      icon: "⬡",
      title: "Del flujo al producto publicado",
      body: "Una vez que un flujo demuestra su valor, LACE puede empaquetarlo como aplicacion independiente — con gestion de usuarios, facturacion e infraestructura. Tu aportas el conocimiento del dominio; la plataforma se encarga del resto."
    }
  ],
  operatingModes: [
    {
      badge: "POL",
      name: "Envolvente de politica",
      detail: "Define modelos permitidos, presupuestos, reglas de datos y niveles de autorizacion alrededor de un flujo."
    },
    {
      badge: "APP",
      name: "Publicacion de apps",
      detail: "Empaqueta un flujo validado como aplicacion web independiente bajo una URL."
    },
    {
      badge: "SUP",
      name: "Supervision de ejecucion",
      detail: "Observa, recomienda, pausa, reintenta o exige revision humana cuando el proceso lo requiere."
    },
    {
      badge: "OPS",
      name: "Infraestructura compartida",
      detail: "Reutiliza hosting, escalamiento, multi-tenant y controles en multiples productos de IA."
    }
  ],
  useCases: [
    {
      id: "proposals",
      tabTitle: "Propuestas y Licitaciones",
      heading: "Propuestas y Licitaciones",
      tagline: "Propuestas que ganan — sin el caos de ultimo momento.",
      summary:
        "Construye un flujo gobernado de propuestas que ingiere requisitos, alinea narrativa entre secciones y mantiene salidas fundamentadas bajo revision.",
      detail:
        "Los equipos de propuestas pasan la mayor parte del tiempo formateando, haciendo referencias cruzadas y reescribiendo contenido que ya existe en algun lugar. LACE ingiere tus materiales fuente — propuestas anteriores, especificaciones tecnicas, requisitos de cumplimiento — y genera secciones fundamentadas en evidencia real, alineadas a los criterios de evaluacion y consistentes en un documento de cien paginas.",
      documents: [
        "RFP o documento de licitacion",
        "Narrativas de desempeno previo y registros de proyectos",
        "Especificaciones tecnicas y estructuras de costo aprobadas",
        "Requisitos de cumplimiento y certificacion"
      ],
      output:
        "Una propuesta completamente redactada, seccion por seccion, donde cada afirmacion enlaza a una fuente, cada seccion cumple los requisitos y el equipo puede ver exactamente que aporto la IA versus lo que escribieron ellos mismos."
    },
    {
      id: "regulatory-compliance",
      tabTitle: "Regulacion y Cumplimiento",
      heading: "Regulacion y Cumplimiento",
      tagline: "Respuestas de cumplimiento sin la carga de la investigacion.",
      summary:
        "Modela un flujo regulatorio capaz de recuperar reglas por jurisdiccion, estructurar respuestas y mantener salidas atadas al texto fuente.",
      detail:
        'Cada vez que un cliente o equipo interno pregunta "cumple esto con la regulacion?" alguien tiene que encontrar la norma, leerla y escribir la respuesta. LACE convierte esa tarea recurrente en un flujo gobernado: extrae el codigo o guia relevante, identifica lo que aplica, estructura la respuesta y cita la fuente. El mismo flujo corre para cada jurisdiccion, cada vez.',
      documents: [
        "Codigos municipales, regulaciones estatales, guias federales",
        "Interpretaciones de agencias y precedentes de cumplimiento",
        "Detalles de proyectos o solicitudes de permiso"
      ],
      output:
        "Resumenes de cumplimiento estructurados y fundamentados en texto fuente actual — no en la memoria del analista sobre lo que decia la regulacion hace seis meses. Repetible para cada nuevo proyecto y jurisdiccion."
    },
    {
      id: "contracts",
      tabTitle: "Legal y Contratos",
      heading: "Legal y Contratos",
      tagline: "Redaccion y revision de contratos con reglas que realmente se cumplen.",
      summary:
        "Crea un flujo de redaccion y redline por clausulas que aplique lenguaje aprobado bajo reglas de negocio y conserve revisabilidad.",
      detail:
        "Los equipos legales saben exactamente como luce el lenguaje aprobado — el problema es aplicarlo consistentemente en decenas de contratos por semana. LACE ejecuta un flujo de redaccion gobernado: aplica bibliotecas de clausulas aprobadas, marca desviaciones de terminos estandar, resalta lo que requiere revision de abogado y produce un redline limpio con cada cambio documentado.",
      documents: [
        "Biblioteca de clausulas aprobadas y posiciones de respaldo",
        "Borrador de la contraparte para revisar o redlinear",
        "Parametros especificos del acuerdo (plazo, jurisdiccion, partes)"
      ],
      output:
        "Un contrato de primer borrador con lenguaje aprobado aplicado, desviaciones marcadas y atencion del abogado dirigida a los elementos que realmente lo necesitan — no al formato o texto estandar."
    },
    {
      id: "policy-updates",
      tabTitle: "Politicas y Estandares",
      heading: "Politicas y Estandares",
      tagline: "Mantener los documentos de politica actualizados cuando cambian las regulaciones.",
      summary:
        "Convierte actualizaciones recurrentes de estandares en un flujo de revision controlado, con lenguaje consistente y puntos de control.",
      detail:
        "Cuando una regulacion se actualiza, cada politica que la referencia necesita revisarse y posiblemente revisarse. En organizaciones grandes, esto es un proyecto de varias semanas de encontrar las politicas afectadas, redactar revisiones, obtener aprobaciones y distribuir los cambios. LACE lo convierte en un flujo controlado: identifica secciones afectadas, genera lenguaje propuesto y produce un documento con seguimiento de cambios para aprobacion final.",
      documents: [
        "Biblioteca de politicas existente",
        "Texto de regulacion nueva o enmendada",
        "Terminologia aprobada y guias de estilo"
      ],
      output:
        "Un flujo de revision de politicas que identifica lo que necesita cambiar, propone ediciones especificas en el lenguaje de tu organizacion y enruta a los aprobadores — sin empezar desde un documento en blanco cada vez."
    },
    {
      id: "financial-analysis",
      tabTitle: "Analisis Financiero",
      heading: "Analisis Financiero",
      tagline: "Convertir informes financieros en inteligencia estructurada.",
      summary:
        "Construye un flujo de extraccion gobernado para informes de ganancias, declaraciones y datos financieros con citas completas de fuente.",
      detail:
        "Leer informes de ganancias, extraer los numeros que importan, compararlos entre trimestres y competidores — es tedioso, repetitivo y propenso a errores cuando se hace manualmente. LACE ingiere documentos financieros, extrae datos estructurados de tablas y texto, verifica la consistencia interna de las cifras y produce resumenes donde cada numero se rastrea a la pagina y seccion fuente.",
      documents: [
        "Informes de ganancias, 10-K, declaraciones anuales",
        "Documentos de periodos anteriores para comparacion",
        "Conjuntos de preguntas de analistas o puntos de datos especificos"
      ],
      output:
        "Resumenes financieros estructurados con citas completas de fuente — extraidos de tus documentos reales, no recordados de los datos de entrenamiento del modelo. Numeros que puedes verificar en treinta segundos."
    },
    {
      id: "intelligence-defense",
      tabTitle: "Inteligencia y Defensa",
      heading: "Inteligencia y Defensa",
      tagline: "Construir sistemas de conocimiento que resistan el escrutinio.",
      summary:
        "Implementa un flujo estructurado de generacion de conocimiento para programas de defensa e inteligencia que requieren repetibilidad, trazabilidad y control.",
      detail:
        "Los programas de defensa e inteligencia necesitan IA que pueda operar en entornos restringidos, mantener trazas de auditoria completas y producir salidas que los analistas puedan verificar — no confiar ciegamente. LACE fue disenado para esto: despliegue air-gapped, cero llamadas a APIs externas, hosting de modelos on-premise y una capa de gobernanza que registra cada decision tomada durante una ejecucion.",
      documents: [
        "Documentos fuente clasificados o restringidos",
        "Bases de conocimiento existentes o marcos ontologicos",
        "Requisitos especificos del programa para extraccion y salida"
      ],
      output:
        "Analisis y construccion de conocimiento asistido por IA que opera completamente dentro de tu perimetro de seguridad, sin datos saliendo de tu entorno y con cadena de custodia completa en cada salida."
    }
  ],
  assuranceTags: [
    "Plano de Control",
    "Revision Humana",
    "Topes de Presupuesto",
    "Pipelines Permitidos",
    "On-Prem"
  ],
  trustItems: [
    "Cada ejecucion puede envolverse en un plano de control para politicas de modelo, presupuesto, datos y autoridad",
    "La salida de IA se trata como propuesta dentro de una ruta de aceptacion definida, no como verdad final",
    "Se pueden exigir checkpoints humanos para acciones sensibles o aprobacion final",
    "Entradas, pasos, salidas e intervenciones permanecen trazables",
    "El objetivo es una IA auditable, no una IA que acierta la mayoria de veces"
  ],
  deploymentOptions: [
    "Publica un flujo como herramienta interna detras de una URL",
    "Lanza apps LACE independientes sobre infraestructura compartida",
    "Despliega en nube privada, on-prem o entornos aislados",
    "Soporta flexibilidad de proveedores, escalamiento y multi-tenant en la capa de plataforma",
    "Usa la misma base para productos SaaS y entregas enterprise personalizadas"
  ]
};

const contentByLocale: Record<HomeLocale, HomeNewContent> = {
  es,
  en
};

export const getHomeNewContent = (locale: HomeLocale): HomeNewContent => {
  return contentByLocale[locale] ?? contentByLocale.es;
};
