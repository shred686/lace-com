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

interface UseCase {
  id: string;
  tabTitle: string;
  heading: string;
  summary: string;
  documents: string[];
  laceFit: string[];
}

interface HomeNewContent {
  heroProofs: string[];
  capabilityTags: string[];
  companyBullets: string[];
  valuePillars: ValuePillar[];
  workflowSteps: WorkflowStep[];
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
  companyBullets: [
    "Model a business use case as a workflow, not a prompt",
    "Apply policies, approved steps, and review gates before AI acts",
    "Keep runs traceable from input to output",
    "Publish proven workflows as internal tools or SaaS products"
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
      id: "permit-research",
      tabTitle: "Permit Research",
      heading: "Permit and compliance research",
      summary:
        "Model a regulatory research workflow that can retrieve jurisdiction-specific rules, structure the answer, and keep outputs tied to source text.",
      documents: ["Municipal codes", "State regulations", "Permit guidance", "Agency source material"],
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
      documents: ["Internal policies", "Standards manuals", "Governance documents", "Update memos"],
      laceFit: ["Controlled section updates", "Terminology consistency", "Review-friendly change records"]
    },
    {
      id: "contracts",
      tabTitle: "Contract Drafting",
      heading: "Contract drafting and redlining",
      summary:
        "Create a clause-aware drafting and redlining workflow that applies approved language under business rules and preserves reviewability.",
      documents: ["NDAs", "MSAs", "Amendments", "Vendor contracts"],
      laceFit: ["Clause-level consistency", "Tracked revision logic", "Faster first-pass drafting"]
    },
    {
      id: "ontology",
      tabTitle: "Ontology Construction",
      heading: "Ontology and knowledge structure generation",
      summary:
        "Stand up a structured knowledge-generation workflow for defense and intelligence programs that need repeatability, traceability, and control.",
      documents: ["Taxonomies", "Research corpora", "Technical reference sets", "Domain source collections"],
      laceFit: [
        "Long-context source handling",
        "Structured output pipelines",
        "Repeatable knowledge generation workflows"
      ]
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
  companyBullets: [
    "Modela un caso de uso de negocio como flujo, no como prompt",
    "Aplica politicas, pasos aprobados y compuertas de revision antes de que la IA actue",
    "Mantiene trazabilidad de cada ejecucion desde la entrada hasta la salida",
    "Publica flujos validados como herramientas internas o productos SaaS"
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
      title: "Define el caso de uso de negocio",
      description:
        "Elige la tarea, las entradas que debe usar, las salidas que debe producir y las condiciones para aceptar el resultado."
    },
    {
      step: "02",
      title: "Configura reglas y restricciones",
      description:
        "Asocia politicas, fuentes aprobadas, acciones permitidas y requisitos de revision antes de que el modelo ejecute."
    },
    {
      step: "03",
      title: "Ejecuta el flujo como pipeline",
      description:
        "LACE ejecuta paso por paso, permitiendo que la IA razone dentro de una ruta definida en lugar de improvisar en un chat."
    },
    {
      step: "04",
      title: "Supervisa, revisa y publica",
      description:
        "Observa la ejecucion, interviene cuando sea necesario y convierte flujos exitosos en herramientas internas o aplicaciones independientes."
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
      id: "permit-research",
      tabTitle: "Investigacion de Permisos",
      heading: "Investigacion de permisos y cumplimiento",
      summary:
        "Modela un flujo regulatorio capaz de recuperar reglas por jurisdiccion, estructurar respuestas y mantener salidas atadas al texto fuente.",
      documents: [
        "Codigos municipales",
        "Regulaciones estatales",
        "Guias de permisos",
        "Fuentes de agencias"
      ],
      laceFit: [
        "Recuperacion sensible a jurisdiccion",
        "Respuestas estructuradas basadas en fuente",
        "Flujos reutilizables para solicitudes repetidas",
        "Producto publicable para uso interno o mercado"
      ]
    },
    {
      id: "proposals",
      tabTitle: "Generacion de Propuestas",
      heading: "Generacion de propuestas para gobierno y salud",
      summary:
        "Construye un flujo gobernado de propuestas que ingiere requisitos, alinea narrativa entre secciones y mantiene salidas fundamentadas bajo revision.",
      documents: [
        "Respuestas a RFP",
        "Volumenes tecnicos y de gestion",
        "Matrices de cumplimiento",
        "Narrativas de desempeno previo"
      ],
      laceFit: [
        "Redaccion fundamentada en fuentes",
        "Regeneracion por seccion sin romper el resto",
        "Terminologia consistente en toda la entrega",
        "Salida lista para revision con cambios trazables"
      ]
    },
    {
      id: "policy-updates",
      tabTitle: "Actualizacion de Politicas",
      heading: "Actualizacion de politicas y estandares empresariales",
      summary:
        "Convierte actualizaciones recurrentes de estandares en un flujo de revision controlado, con lenguaje consistente y puntos de control de revision.",
      documents: ["Politicas internas", "Manuales de estandares", "Documentos de gobierno", "Memorandos de actualizacion"],
      laceFit: ["Actualizaciones controladas por seccion", "Consistencia terminologica", "Registros de cambios amigables para revision"]
    },
    {
      id: "contracts",
      tabTitle: "Redaccion de Contratos",
      heading: "Redaccion y versionado de contratos",
      summary:
        "Crea un flujo de redaccion y redline por clausulas que aplique lenguaje aprobado bajo reglas de negocio y conserve revisabilidad.",
      documents: ["NDA", "MSA", "Enmiendas", "Contratos con proveedores"],
      laceFit: ["Consistencia a nivel clausula", "Logica de revision trazable", "Primer borrador mas rapido"]
    },
    {
      id: "ontology",
      tabTitle: "Construccion de Ontologias",
      heading: "Generacion de ontologias y estructuras de conocimiento",
      summary:
        "Implementa un flujo estructurado de generacion de conocimiento para programas de defensa e inteligencia que requieren repetibilidad, trazabilidad y control.",
      documents: ["Taxonomias", "Corpus de investigacion", "Conjuntos tecnicos de referencia", "Colecciones de fuentes de dominio"],
      laceFit: [
        "Manejo de fuentes de largo contexto",
        "Pipelines de salida estructurada",
        "Flujos repetibles de generacion de conocimiento"
      ]
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
