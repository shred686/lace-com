import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Draft / internal pages that must stay out of the sitemap and search index.
const EXCLUDED = ["/contact/success"];

export default defineConfig({
  site: "https://laceplatform.com",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.some((path) => page.includes(path))
    })
  ]
});
