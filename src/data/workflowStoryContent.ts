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
    sectionEyebrow: "Workflow Story",
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
      id: "ingest-brief",
      eyebrow: "01 // Ingest the brief",
      title: "Start with mission constraints, not a blank prompt.",
      body:
        "We load objectives, evaluation criteria, approved language, and operating limits before any synthesis begins, so the run starts inside a defined operating envelope.",
      progressStart: 0,
      progressEnd: 0.22
    },
    {
      id: "retrieve-context",
      eyebrow: "02 // Retrieve public + private context",
      title: "Pull the evidence that should shape the run.",
      body:
        "The workflow searches public sources, retrieves internal corpus, and ranks both into a working context pack instead of asking the model to rely on memory.",
      progressStart: 0.22,
      progressEnd: 0.58
    },
    {
      id: "build-decision",
      eyebrow: "03 // Build governed decision context",
      title: "Turn raw evidence into a route the team can inspect.",
      body:
        "LACE composes source weights, policy rails, and approval logic so the next action is selected inside rules your team can trace, review, and override.",
      progressStart: 0.58,
      progressEnd: 0.82
    },
    {
      id: "synthesize-export",
      eyebrow: "04 // Synthesize and export",
      title: "Draft, review, and ship without losing provenance.",
      body:
        "The system produces a governed draft, routes it through review gates, and exports a packet whose claims stay tied to the evidence that produced them.",
      progressStart: 0.82,
      progressEnd: 1
    }
  ],
  nodes: [
    {
      id: "load-brief",
      stepId: "ingest-brief",
      badge: "Load",
      title: "Load brief",
      detail: "Mission priorities, approved language, proposal rules, and source requirements are mounted into the run context.",
      footer: "1 brief packet",
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
      badge: "Search",
      title: "Search public web",
      detail: "Public programs, grants, and modernization guidance are retrieved against the brief before drafting starts.",
      footer: "6 live sources",
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
      badge: "Retrieve",
      title: "Retrieve private corpus",
      detail: "Past proposals, policy packs, and capability notes are pulled in alongside public evidence for governed grounding.",
      footer: "12 internal docs",
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
      badge: "Context",
      title: "Build context pack",
      detail: "Evidence, source weights, and policy rails are composed into one ranked decision surface for the run.",
      footer: "ranked evidence map",
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
      title: "Decide route",
      detail: "Risk, fit, and scope gates select the next branch instead of letting the system improvise execution order.",
      footer: "policy gate passed",
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
      badge: "Draft",
      title: "Draft response",
      detail: "Executive summary, workplan, and differentiators are generated inside the governed context that was just assembled.",
      footer: "governed synthesis",
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
      badge: "Deliver",
      title: "Review + export",
      detail: "The packet is routed through approval, citations stay attached, and the final deliverable is exported with provenance intact.",
      footer: "packet ready",
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
  connectors: [
    {
      id: "route-1",
      stepId: "ingest-brief",
      revealNodeId: "load-brief",
      path: connectorPath([356, 84], [356, 184], [304, 184])
    },
    {
      id: "route-2",
      stepId: "retrieve-context",
      revealNodeId: "search-public-web",
      path: connectorPath([304, 184], [356, 184], [356, 600], [388, 600])
    },
    {
      id: "route-3",
      stepId: "retrieve-context",
      revealNodeId: "retrieve-private-corpus",
      path: connectorPath([388, 600], [356, 600], [356, 760], [344, 760])
    },
    {
      id: "route-4",
      stepId: "retrieve-context",
      revealNodeId: "build-context-pack",
      path: connectorPath([344, 760], [356, 760], [356, 920], [388, 920])
    },
    {
      id: "route-5",
      stepId: "build-decision",
      revealNodeId: "decide-route",
      path: connectorPath([388, 920], [356, 920], [356, 1124], [344, 1124])
    },
    {
      id: "route-6",
      stepId: "build-decision",
      revealNodeId: "draft-response",
      path: connectorPath([344, 1124], [356, 1124], [356, 1366], [392, 1366])
    },
    {
      id: "route-7",
      stepId: "synthesize-export",
      revealNodeId: "review-export",
      path: connectorPath([392, 1366], [356, 1366], [356, 1540])
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
