import type { HomeLocale } from "./homeNewContent";

export interface WorkflowStoryStep {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  progressStart: number;
  progressEnd: number;
}

export interface WorkflowGraphNode {
  id: string;
  stepId: string;
  badge: string;
  title: string;
  detail: string;
  footer: string;
  runtime: string;
  x: number;
  y: number;
  width: number;
  height: number;
  align: "left" | "right" | "center";
  entryX: number;
  entryY: number;
}

export interface WorkflowConnector {
  id: string;
  stepId: string;
  revealNodeId: string;
  path: string;
}

export interface WorkflowStoryMeta {
  sectionEyebrow: string;
  graphLabel: string;
  graphTitle: string;
  runId: string;
  progressLabel: string;
  activeLabel: string;
  graphWidth: number;
  graphHeight: number;
}

export interface WorkflowStoryContent {
  meta: WorkflowStoryMeta;
  steps: WorkflowStoryStep[];
  nodes: WorkflowGraphNode[];
  connectors: WorkflowConnector[];
}

type PathPoint = [number, number];

const roundedPath = (points: PathPoint[], radius = 12): string => {
  if (points.length < 2) return "";
  if (points.length === 2) return `M${points[0][0]} ${points[0][1]} L${points[1][0]} ${points[1][1]}`;

  const clampRadius = (value: number, maxA: number, maxB: number) => Math.min(value, maxA / 2, maxB / 2);
  let path = `M${points[0][0]} ${points[0][1]}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const [prevX, prevY] = points[index - 1];
    const [currX, currY] = points[index];
    const [nextX, nextY] = points[index + 1];

    const prevDx = currX - prevX;
    const prevDy = currY - prevY;
    const nextDx = nextX - currX;
    const nextDy = nextY - currY;

    const prevLength = Math.hypot(prevDx, prevDy);
    const nextLength = Math.hypot(nextDx, nextDy);

    if (prevLength === 0 || nextLength === 0) {
      path += ` L${currX} ${currY}`;
      continue;
    }

    const turnRadius = clampRadius(radius, prevLength, nextLength);
    const entryX = currX - (prevDx / prevLength) * turnRadius;
    const entryY = currY - (prevDy / prevLength) * turnRadius;
    const exitX = currX + (nextDx / nextLength) * turnRadius;
    const exitY = currY + (nextDy / nextLength) * turnRadius;

    path += ` L${entryX} ${entryY} Q${currX} ${currY} ${exitX} ${exitY}`;
  }

  const lastPoint = points[points.length - 1];
  path += ` L${lastPoint[0]} ${lastPoint[1]}`;

  return path;
};

const connectorPath = (...points: PathPoint[]) => roundedPath(points);

const en: WorkflowStoryContent = {
  meta: {
    sectionEyebrow: "",
    graphLabel: "LACE // GOVERNED WORKFLOW",
    graphTitle: "Proposal assembly runtime",
    runId: "run cf2a91b0",
    progressLabel: "sequence",
    activeLabel: "active node",
    graphWidth: 720,
    graphHeight: 1780
  },
  steps: [
    {
      id: "intro",
      eyebrow: "INTRO",
      title: "State of the art modeling",
      body:
        "LACE starts with the knowledge, rules, documents, and workflows that already run your organization. Then it turns them into governed AI applications that can answer, act, draft, review, and produce work with source grounding and operational control.",
      progressStart: 0,
      progressEnd: 0.16
    },
    {
      id: "ingestion",
      eyebrow: "01 // Ingestion",
      title: "Ingestion - Building your enterprise knowledge base",
      body:
        "LACE helps turn your internal materials into an AI-ready knowledge base: policies, proposals, reports, manuals, financial decks, RFPs, standards, contracts, product documentation, and operational records. Instead of flattening everything into generic text, LACE is designed to preserve the structure that matters: sections, tables, charts, figures, facts, claims, and source relationships.",
      progressStart: 0.16,
      progressEnd: 0.32
    },
    {
      id: "retrieval",
      eyebrow: "02 // Retrieval",
      title: "Retrieval",
      body:
        "When a user asks a question or starts a workflow, LACE does not simply search for a nearby paragraph. It looks for the right evidence. That may mean finding an exact fact in a table, pulling context from a source document, comparing across reports, grounding an answer in a chart or figure, or recognizing when a broader corpus-wide review is required.",
      progressStart: 0.32,
      progressEnd: 0.52
    },
    {
      id: "workflow-planning",
      eyebrow: "03 // Workflow Planning",
      title: "Workflow Planning",
      body:
        "LACE converts user intent into a governed plan. The platform determines what needs to happen, which sources and tools are relevant, what policies apply, what level of confidence is required, and where human review should remain in the loop.",
      progressStart: 0.52,
      progressEnd: 0.68
    },
    {
      id: "execution",
      eyebrow: "04 // Execution",
      title: "Execution",
      body:
        "LACE runs the work through structured workflows that can combine AI reasoning, retrieval, business logic, approved tools, document generation, artifact editing, and human approvals. The result can be an answer, a revised document, a compliance review, a proposal section, a report, or an entire application workflow.",
      progressStart: 0.68,
      progressEnd: 0.84
    },
    {
      id: "validation-audit",
      eyebrow: "05 // Validation and Audit Trail",
      title: "Validation and Audit Trail",
      body:
        "LACE keeps AI outputs accountable. Sources can be inspected, citations can be checked, proposed changes can be reviewed before they are applied, and every run leaves behind a trace of what happened. Teams get the speed of AI with the auditability required for real enterprise work.",
      progressStart: 0.84,
      progressEnd: 1
    }
  ],
  nodes: [
    {
      id: "state-model",
      stepId: "intro",
      badge: "Model",
      title: "Model the business context",
      detail: "Knowledge, rules, documents, and workflows are assembled into the operating frame LACE will govern.",
      footer: "business system mapped",
      runtime: "112ms",
      x: 192,
      y: 92,
      width: 328,
      height: 144,
      align: "center",
      entryX: 0,
      entryY: 18
    },
    {
      id: "knowledge-base",
      stepId: "ingestion",
      badge: "Ingest",
      title: "Build knowledge base",
      detail: "Policies, proposals, manuals, contracts, tables, figures, and operational records are preserved with source structure intact.",
      footer: "enterprise corpus ready",
      runtime: "184ms",
      x: 54,
      y: 348,
      width: 270,
      height: 146,
      align: "left",
      entryX: -26,
      entryY: 18
    },
    {
      id: "evidence-retrieval",
      stepId: "retrieval",
      badge: "Retrieve",
      title: "Retrieve right evidence",
      detail: "Exact facts, source passages, tables, charts, and cross-document context are selected for the workflow at hand.",
      footer: "grounded context pack",
      runtime: "612ms",
      x: 388,
      y: 618,
      width: 280,
      height: 142,
      align: "right",
      entryX: 24,
      entryY: 18
    },
    {
      id: "governed-plan",
      stepId: "workflow-planning",
      badge: "Plan",
      title: "Plan governed route",
      detail: "Intent, sources, policy checks, confidence needs, and human review points are compiled into a controlled execution path.",
      footer: "policy route selected",
      runtime: "96ms",
      x: 78,
      y: 900,
      width: 274,
      height: 136,
      align: "left",
      entryX: -18,
      entryY: 16
    },
    {
      id: "execute-workflow",
      stepId: "execution",
      badge: "Execute",
      title: "Run workflow",
      detail: "AI reasoning, retrieval, business logic, approved tools, artifact edits, and review gates run as one structured process.",
      footer: "governed work in flight",
      runtime: "544ms",
      x: 388,
      y: 1168,
      width: 260,
      height: 140,
      align: "right",
      entryX: 22,
      entryY: 18
    },
    {
      id: "validation-trail",
      stepId: "validation-audit",
      badge: "Validate",
      title: "Validate audit trail",
      detail: "Sources, citations, proposed changes, approvals, and every run event stay inspectable after the output is delivered.",
      footer: "trace retained",
      runtime: "196ms",
      x: 192,
      y: 1458,
      width: 328,
      height: 150,
      align: "center",
      entryX: 0,
      entryY: 20
    }
  ],
  connectors: [
    {
      id: "route-1",
      stepId: "intro",
      revealNodeId: "state-model",
      path: connectorPath([356, 52], [356, 92])
    },
    {
      id: "route-2",
      stepId: "ingestion",
      revealNodeId: "knowledge-base",
      path: connectorPath([356, 236], [356, 421], [324, 421])
    },
    {
      id: "route-3",
      stepId: "retrieval",
      revealNodeId: "evidence-retrieval",
      path: connectorPath([324, 421], [356, 421], [356, 689], [388, 689])
    },
    {
      id: "route-4",
      stepId: "workflow-planning",
      revealNodeId: "governed-plan",
      path: connectorPath([388, 689], [356, 689], [356, 968], [352, 968])
    },
    {
      id: "route-5",
      stepId: "execution",
      revealNodeId: "execute-workflow",
      path: connectorPath([352, 968], [356, 968], [356, 1238], [388, 1238])
    },
    {
      id: "route-6",
      stepId: "validation-audit",
      revealNodeId: "validation-trail",
      path: connectorPath([388, 1238], [356, 1238], [356, 1458])
    }
  ]
};

const es: WorkflowStoryContent = {
  meta: {
    sectionEyebrow: "Historia del flujo",
    graphLabel: "LACE // FLUJO GOBERNADO",
    graphTitle: "Ejecucion de propuesta",
    runId: "run cf2a91b0",
    progressLabel: "secuencia",
    activeLabel: "nodo activo",
    graphWidth: 720,
    graphHeight: 1780
  },
  steps: [
    {
      id: "ingest-brief",
      eyebrow: "01 // Ingerir el brief",
      title: "El flujo arranca con restricciones reales, no con un prompt vacio.",
      body:
        "Cargamos objetivos, criterios de evaluacion, lenguaje aprobado y limites operativos antes de cualquier sintesis, para que la ejecucion empiece dentro de un marco definido.",
      progressStart: 0,
      progressEnd: 0.22
    },
    {
      id: "retrieve-context",
      eyebrow: "02 // Recuperar contexto publico + privado",
      title: "Traer la evidencia que debe moldear la ejecucion.",
      body:
        "El flujo consulta fuentes publicas, recupera corpus interno y ordena ambos en un paquete de contexto en lugar de pedirle al modelo que improvise desde la memoria.",
      progressStart: 0.22,
      progressEnd: 0.58
    },
    {
      id: "build-decision",
      eyebrow: "03 // Construir contexto de decision gobernado",
      title: "Convertir evidencia cruda en una ruta revisable.",
      body:
        "LACE compone pesos de fuente, reglas de politica y logica de aprobacion para que la siguiente accion se elija dentro de reglas que el equipo puede rastrear y ajustar.",
      progressStart: 0.58,
      progressEnd: 0.82
    },
    {
      id: "synthesize-export",
      eyebrow: "04 // Sintetizar y exportar",
      title: "Redactar, revisar y entregar sin perder proveniencia.",
      body:
        "El sistema produce un borrador gobernado, lo pasa por puertas de revision y exporta un paquete cuyas afirmaciones siguen unidas a la evidencia que las produjo.",
      progressStart: 0.82,
      progressEnd: 1
    }
  ],
  nodes: [
    {
      id: "load-brief",
      stepId: "ingest-brief",
      badge: "Carga",
      title: "Cargar brief",
      detail: "Prioridades de mision, lenguaje aprobado y reglas de propuesta se montan en el contexto de ejecucion.",
      footer: "1 paquete base",
      runtime: "184ms",
      x: 54,
      y: 116,
      width: 250,
      height: 136,
      align: "left",
      entryX: -26,
      entryY: 18
    },
    {
      id: "search-public-web",
      stepId: "retrieve-context",
      badge: "Busca",
      title: "Buscar web publica",
      detail: "Programas, subvenciones y guias publicas se recuperan contra el brief antes de redactar.",
      footer: "6 fuentes en vivo",
      runtime: "612ms",
      x: 388,
      y: 534,
      width: 252,
      height: 132,
      align: "right",
      entryX: 24,
      entryY: 18
    },
    {
      id: "retrieve-private-corpus",
      stepId: "retrieve-context",
      badge: "Recupera",
      title: "Recuperar corpus privado",
      detail: "Propuestas previas, politicas y notas internas se combinan con la evidencia publica para dar fundamento gobernado.",
      footer: "12 docs internos",
      runtime: "428ms",
      x: 74,
      y: 694,
      width: 270,
      height: 132,
      align: "left",
      entryX: -22,
      entryY: 18
    },
    {
      id: "build-context-pack",
      stepId: "retrieve-context",
      badge: "Contexto",
      title: "Construir contexto",
      detail: "Evidencia, pesos de fuente y reglas de politica se convierten en una sola superficie de decision.",
      footer: "mapa de evidencia",
      runtime: "311ms",
      x: 388,
      y: 848,
      width: 280,
      height: 144,
      align: "right",
      entryX: 18,
      entryY: 18
    },
    {
      id: "decide-route",
      stepId: "build-decision",
      badge: "Decide",
      title: "Decidir ruta",
      detail: "Riesgo, encaje y alcance activan la siguiente rama en lugar de dejar que el sistema improvise.",
      footer: "puerta aprobada",
      runtime: "96ms",
      x: 92,
      y: 1060,
      width: 252,
      height: 128,
      align: "left",
      entryX: -18,
      entryY: 16
    },
    {
      id: "draft-response",
      stepId: "build-decision",
      badge: "Redacta",
      title: "Redactar respuesta",
      detail: "Resumen ejecutivo, plan de trabajo y diferenciadores se generan dentro del contexto gobernado.",
      footer: "sintesis controlada",
      runtime: "544ms",
      x: 392,
      y: 1300,
      width: 248,
      height: 132,
      align: "right",
      entryX: 22,
      entryY: 18
    },
    {
      id: "review-export",
      stepId: "synthesize-export",
      badge: "Entrega",
      title: "Revisar + exportar",
      detail: "El paquete pasa por aprobacion, mantiene citas unidas y sale listo para entrega final.",
      footer: "paquete listo",
      runtime: "196ms",
      x: 192,
      y: 1540,
      width: 328,
      height: 146,
      align: "center",
      entryX: 0,
      entryY: 20
    }
  ],
  connectors: en.connectors
};

export const getWorkflowStoryContent = (locale: HomeLocale): WorkflowStoryContent =>
  locale === "es" ? es : en;
