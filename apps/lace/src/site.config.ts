export const laceSite = {
  name: "LACE",
  domain: "laceplatform.com",
  url: "https://laceplatform.com",
  contactEmail: "info@laceplatform.com",
  contactPhone: "+1 (727) 282-4564",
  contactPhoneHref: "tel:+17272824564",
  title: "LACE | Governed AI workflow infrastructure",
  description:
    "LACE turns business workflows into governed, repeatable AI systems with policy controls, evidence grounding, and auditable output."
} as const;

// Organization structured data (schema.org). Emitted on the homepage only.
export const laceOrganization = {
  name: laceSite.name,
  url: `${laceSite.url}/`,
  logo: `${laceSite.url}/apple-touch-icon.png`,
  description:
    "LACE is governed AI workflow infrastructure that turns business workflows into repeatable, auditable AI systems with policy controls and evidence grounding.",
  email: laceSite.contactEmail,
  telephone: "+1-727-282-4564",
  // Add verified profile URLs (e.g. LinkedIn company page, GitHub org) to
  // strengthen entity disambiguation in Search.
  sameAs: [] as string[]
};
