import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL || "https://determinantsystems.com",
  base: process.env.BASE_PATH || "/",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
