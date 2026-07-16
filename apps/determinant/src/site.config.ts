export const determinantSite = {
  name: "Determinant Systems",
  domain: "determinantsystems.com",
  url: "https://determinantsystems.com",
  contactEmail: "info@determinantsystems.com",
  contactPhone: "+1 (727) 282-4564",
  contactPhoneHref: "tel:+17272824564",
  title: "Determinant Systems | Make AI work for your company",
  description:
    "Make AI work for your company. LACE is infrastructure for enterprise AI, built for modeling business workflows under policy constraints and turning them into deployable AI products."
} as const;

// Organization structured data (schema.org). Emitted on the homepage only.
export const determinantOrganization = {
  name: determinantSite.name,
  url: `${determinantSite.url}/`,
  logo: `${determinantSite.url}/apple-touch-icon.png`,
  description:
    "Determinant Systems designs and builds governed enterprise AI systems — AI workflows, enterprise search, retrieval, and knowledge graphs.",
  email: determinantSite.contactEmail,
  telephone: "+1-727-282-4564",
  // Add verified profile URLs (e.g. LinkedIn company page, GitHub org) to
  // strengthen entity disambiguation in Search.
  sameAs: [] as string[]
};
