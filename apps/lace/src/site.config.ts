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

// LACE is a product of Determinant Systems, not its own organization. Model it
// as a SoftwareApplication published by the Determinant Systems org, referenced
// by the same @id the org declares on its own domain. Emitted on the
// homepage only.
const determinantOrgId = "https://determinantsystems.com/#organization";

export const laceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": determinantOrgId,
      name: "Determinant Systems",
      url: "https://determinantsystems.com/",
      logo: "https://determinantsystems.com/apple-touch-icon.png",
      sameAs: [
        "https://www.linkedin.com/company/determinant-systems-inc/",
        "https://github.com/Determinant-Systems"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${laceSite.url}/#lace`,
      name: laceSite.name,
      url: `${laceSite.url}/`,
      description:
        "LACE is governed AI workflow infrastructure that turns business workflows into repeatable, auditable AI systems with policy controls and evidence grounding.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      image: `${laceSite.url}/og-image.png`,
      publisher: { "@id": determinantOrgId }
    }
  ]
};
