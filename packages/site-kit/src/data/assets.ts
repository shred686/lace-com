/**
 * Stable public URLs for downloadable collateral.
 *
 * These files live in each app's `public/` directory rather than being imported
 * through the Astro asset pipeline. A bundled import emits a content-hashed path
 * (`/_astro/LACE_Enterprise_Overview_v3.D3J6Ig7c.pdf`) that changes on every
 * rebuild, so any external link or search-engine citation to the PDF breaks. A
 * fixed, human-readable path keeps the document linkable and indexable — PDFs
 * rank well for the procurement-style queries this buyer actually runs.
 */
export const whitepaperEnglishUrl = "/LACE-Platform-Overview.pdf";
export const whitepaperSpanishUrl = "/LACE-Platform-Overview-es.pdf";
