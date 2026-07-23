import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Draft / internal pages that must stay out of the sitemap and search index.
const EXCLUDED = ["/home-new", "/themes/", "/contact/success"];

export default defineConfig({
  site: "https://determinantsystems.com",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          es: "es"
        }
      },
      filter: (page) => !EXCLUDED.some((path) => page.includes(path)),
      serialize: (item) => {
        if (item.url === "https://determinantsystems.com/" || item.url === "https://determinantsystems.com/es/") {
          return {
            ...item,
            links: [
              ...(item.links ?? []),
              { lang: "x-default", url: "https://determinantsystems.com/" }
            ]
          };
        }
        return item;
      }
    })
  ]
});
