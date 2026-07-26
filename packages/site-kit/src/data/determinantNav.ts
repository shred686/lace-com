/**
 * The canonical Determinant Systems navigation model.
 *
 * The home page nav is the site's single source of truth: every public page
 * must be reachable from it. Both the header (DeterminantNav) and the footer
 * (DeterminantFooter) render from this file, so adding a page here is the only
 * step required to make it reachable everywhere.
 */

export type NavLocale = "en" | "es";

export interface NavService {
  /** Destination page. */
  href: string;
  /** Nav label — uppercase in the bar, per the type system. */
  label: string;
  /** Spanish label, used on the /es/ surface. */
  labelEs: string;
  /** One line of orientation shown in the desktop menu. */
  blurb: string;
  blurbEs: string;
  /** The capability's owned hue from the service spectrum. */
  accent: string;
}

/**
 * The six capabilities. The hues match the home page service tiles and the
 * `--svc` value on each deep-dive section; changing one without the other
 * breaks the tile/section association.
 */
export const navServices: NavService[] = [
  {
    href: "/services/ai-agent-development",
    label: "AI Agents",
    labelEs: "Agentes de IA",
    blurb: "Digital teammates that take a task and drive it to done.",
    blurbEs: "Compañeros digitales que llevan una tarea hasta el final.",
    accent: "#5be9ff",
  },
  {
    href: "/services/custom-ai-application-development",
    label: "App Factory",
    labelEs: "Fábrica de Apps",
    blurb: "Describe the tool your team needs; get deployed software.",
    blurbEs: "Describe la herramienta que necesitas; recibe software desplegado.",
    accent: "#ff9d7a",
  },
  {
    href: "/services/ai-workflow-automation",
    label: "LLM-Powered Workflows",
    labelEs: "Flujos con LLM",
    blurb: "AI that runs a business process step by step, with checks.",
    blurbEs: "IA que ejecuta un proceso paso a paso, con controles.",
    accent: "#00ffc2",
  },
  {
    href: "/services/retrieval-augmented-generation",
    label: "Retrieval-Augmented Generation",
    labelEs: "Generación Aumentada por Recuperación",
    blurb: "Answers written from your documents, with citations.",
    blurbEs: "Respuestas escritas desde tus documentos, con citas.",
    accent: "#ffd86f",
  },
  {
    href: "/services/enterprise-search",
    label: "Enterprise Search",
    labelEs: "Búsqueda Empresarial",
    blurb: "One search across every place your company keeps information.",
    blurbEs: "Una búsqueda en todos los lugares donde vive la información.",
    accent: "#7aa2ff",
  },
  {
    href: "/services/knowledge-graphs",
    label: "Knowledge Graphs",
    labelEs: "Grafos de Conocimiento",
    blurb: "Your documents, distilled into a network of facts you can query.",
    blurbEs: "Tus documentos, destilados en una red de hechos consultable.",
    accent: "#c58dff",
  },
];

export const servicesIndexHref = "/services";

/** The firm accent, used by surfaces that are not one single capability. */
export const firmAccent = "#00ffc2";

/**
 * The hue a service page carries. Pages outside the six capabilities fall back
 * to the firm accent — per the one-light rule a surface takes one or the other,
 * never both.
 */
export function serviceAccent(slugOrHref: string): string {
  const slug = slugOrHref.replace(/^\/services\//, "").replace(/\/+$/, "");
  return navServices.find((service) => service.href.endsWith(`/${slug}`))?.accent ?? firmAccent;
}

/**
 * Sections that live on the home page. Off-home they resolve to `/#id`, which
 * is why they are modelled as ids rather than as literal hrefs.
 *
 * The two locales render different home components (HomeV2Page vs.
 * HomeNewPage), so each declares the anchors it actually has — a link here that
 * the page does not carry is a dead anchor on every page of the site.
 */
export const navSections = {
  en: [
    { id: "platform", label: "Platform" },
    { id: "how-we-work", label: "How We Work" },
  ],
  es: [
    { id: "platform", label: "Plataforma" },
    { id: "use-cases", label: "Casos de Uso" },
  ],
} as const;

export const navCopy = {
  en: {
    brandHref: "/",
    services: "What We Build",
    allServices: "All services",
    about: "About",
    contact: "Contact us",
    toggle: "Toggle navigation",
    servicesMenu: "Services menu",
    primary: "Primary",
    languageHref: "/es/",
    languageLabel: "Español",
    languageAria: "Ver este sitio en español",
    company: "Company",
    platformProduct: "LACE Platform",
    tagline: "Enterprise AI infrastructure",
    footerNav: "Footer",
  },
  es: {
    brandHref: "/es/",
    services: "Qué Construimos",
    allServices: "Todos los servicios",
    about: "Nosotros",
    contact: "Contáctanos",
    toggle: "Alternar navegación",
    servicesMenu: "Menú de servicios",
    primary: "Principal",
    languageHref: "/",
    languageLabel: "English",
    languageAria: "View this site in English",
    company: "Empresa",
    platformProduct: "Plataforma LACE",
    tagline: "Infraestructura de IA empresarial",
    footerNav: "Pie de página",
  },
} as const;

export const lacePlatformHref = "https://laceplatform.com";
export const contactHref = "/contact";
export const aboutHref = "/about";

/**
 * Resolve the canonical link set for a page.
 *
 * `pathname` decides whether the home-page sections are in-page anchors or
 * links back to the home page — the reason the old interior nav had to drop
 * them entirely and diverged from the home nav in the first place.
 */
const trimPath = (value: string) => value.replace(/\/+$/, "") || "/";

export function resolveNav(locale: NavLocale = "en", pathname = "/") {
  const t = navCopy[locale];
  const homePath = locale === "es" ? "/es/" : "/";
  const normalized = trimPath(pathname);
  const onHome = normalized === trimPath(homePath);

  return {
    t,
    locale,
    onHome,
    isCurrent: (href: string) => normalized === trimPath(href),
    sections: navSections[locale].map((section) => ({
      href: onHome ? `#${section.id}` : `${homePath}#${section.id}`,
      label: section.label,
    })),
    services: navServices.map((service) => ({
      href: service.href,
      label: locale === "es" ? service.labelEs : service.label,
      blurb: locale === "es" ? service.blurbEs : service.blurb,
      accent: service.accent,
    })),
  };
}
