export const determinantSite = {
  name: "Determinant Systems",
  domain: "determinantsystems.com",
  url: "https://determinantsystems.com",
  contactEmail: "info@determinantsystems.com",
  contactPhone: "+1 (727) 282-4564",
  contactPhoneHref: "tel:+17272824564",
  title: "Enterprise AI Consulting & Engineering | Determinant Systems",
  description:
    "Enterprise AI consulting and engineering for governed agents, RAG, search, knowledge graphs, workflow automation, and custom AI applications."
} as const;

// Stable schema.org node id for the Determinant Systems organization. LACE's
// markup references this same id as its publisher.
export const determinantOrgId = `${determinantSite.url}/#organization`;

// Organization structured data (schema.org). Emitted on the homepage only.
export const determinantJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": determinantOrgId,
      name: determinantSite.name,
      url: `${determinantSite.url}/`,
      logo: {
        "@type": "ImageObject",
        url: `${determinantSite.url}/apple-touch-icon.png`,
      },
      description:
        "Determinant Systems is an enterprise AI engineering firm that designs and builds governed agents, retrieval systems, enterprise search, knowledge graphs, workflow automation, and custom AI applications.",
      email: determinantSite.contactEmail,
      telephone: "+1-727-282-4564",
      knowsAbout: [
        "Enterprise artificial intelligence",
        "AI agents",
        "Retrieval-augmented generation",
        "Enterprise search",
        "Knowledge graphs",
        "AI workflow automation",
      ],
      sameAs: [
        "https://www.linkedin.com/company/determinant-systems-inc/",
        "https://github.com/Determinant-Systems"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${determinantSite.url}/#website`,
      url: `${determinantSite.url}/`,
      name: determinantSite.name,
      description: determinantSite.description,
      publisher: { "@id": determinantOrgId },
      inLanguage: ["en", "es"],
    },
  ]
};
