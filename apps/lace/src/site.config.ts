export const laceSite = {
  name: "LACE",
  domain: "laceplatform.com",
  url: "https://laceplatform.com",
  contactEmail: "info@laceplatform.com",
  contactPhone: "+1 (727) 282-4564",
  contactPhoneHref: "tel:+17272824564",
  title: "Enterprise AI Platform for Governed Search & Agents | LACE",
  description:
    "LACE unifies enterprise search, a provable knowledge graph, governed AI agents, and an app builder on one platform — with provenance, policy enforcement, and audit."
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
      applicationSubCategory: "Enterprise AI Platform",
      operatingSystem: "Web",
      image: `${laceSite.url}/og-image.png`,
      featureList: [
        "Permissions-aware enterprise search",
        "Evidence-locked bitemporal knowledge graph",
        "Policy-governed AI agents",
        "AI application builder",
        "Cloud, private cloud, on-premises, and air-gapped deployment",
      ],
      publisher: { "@id": determinantOrgId }
    },
    {
      "@type": "WebSite",
      "@id": `${laceSite.url}/#website`,
      url: `${laceSite.url}/`,
      name: laceSite.name,
      description: laceSite.description,
      publisher: { "@id": determinantOrgId },
      inLanguage: "en",
    }
  ]
};

export const createLaceOfferingJsonLd = ({
  path,
  name,
  description,
  faqs = [],
}: {
  path: string;
  name: string;
  description: string;
  faqs?: Array<{ q: string; a: string }>;
}) => {
  const url = `${laceSite.url}${path.endsWith("/") ? path : `${path}/`}`;
  return [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${laceSite.url}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Platform",
          item: `${laceSite.url}/#platform`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name,
          item: url,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: `LACE ${name}`,
      description,
      url,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: name,
      operatingSystem: "Web",
      isPartOf: { "@id": `${laceSite.url}/#lace` },
      publisher: { "@id": determinantOrgId },
    },
    ...(faqs.length
      ? [{
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }]
      : []),
  ];
};
