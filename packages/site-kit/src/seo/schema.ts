export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqSchema = (items: FaqItem[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
});

export const serviceSchema = ({
  id,
  name,
  description,
  url,
  providerId,
  serviceType,
}: {
  id: string;
  name: string;
  description: string;
  url: string;
  providerId: string;
  serviceType: string;
}) => ({
  "@type": "Service",
  "@id": id,
  name,
  description,
  url,
  serviceType,
  provider: { "@id": providerId },
});

