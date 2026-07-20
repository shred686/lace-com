export const laceSite = {
  name: "LACE",
  domain: "laceplatform.com",
  url: "https://laceplatform.com",
  contactEmail: "info@laceplatform.com",
  contactPhone: "+1 (727) 282-4564",
  contactPhoneHref: "tel:+17272824564",
  title: "LACE | The AI Platform for the Governed Enterprise",
  description:
    "LACE unifies enterprise search, a provable knowledge graph, governed AI agents, and an app builder on one platform — with provenance, policy enforcement, and a complete audit trail."
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
        "LACE is the AI platform for the governed enterprise: permissions-aware enterprise search, an evidence-locked knowledge graph, policy-governed AI agents across every channel, and an app builder that turns one prompt into deployed software.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      image: `${laceSite.url}/og-image.png`,
      publisher: { "@id": determinantOrgId }
    }
  ]
};
