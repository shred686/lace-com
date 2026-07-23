import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const sites = [
  { app: "determinant", origin: "https://determinantsystems.com" },
  { app: "lace", origin: "https://laceplatform.com" },
];

const failures = [];

const decodeHtml = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

async function walkHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(path));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const firstMatch = (html, pattern) => html.match(pattern)?.[1];

for (const site of sites) {
  const dist = join("apps", site.app, "dist");
  const sitemapXml = await readFile(join(dist, "sitemap-0.xml"), "utf8");
  const sitemapUrls = new Set(
    [...sitemapXml.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1])),
  );
  const canonicalUrls = new Set();
  const titles = new Map();
  const descriptions = new Map();

  for (const file of await walkHtml(dist)) {
    const html = await readFile(file, "utf8");
    const route = relative(dist, file).replace(/index\.html$/, "").replace(/\.html$/, "");
    const label = `${site.app}:${route || "/"}`;
    const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
    const title = decodeHtml(firstMatch(html, /<title>([^<]*)<\/title>/i) ?? "").trim();
    const description = decodeHtml(firstMatch(html, /<meta name="description" content="([^"]*)"/i) ?? "").trim();
    const canonical = firstMatch(html, /<link rel="canonical" href="([^"]+)"/i);
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;

    if (!title) failures.push(`${label} has no title`);
    if (!description) failures.push(`${label} has no meta description`);
    if (!canonical) failures.push(`${label} has no canonical URL`);
    if (canonical && !canonical.startsWith(site.origin)) failures.push(`${label} canonical leaves ${site.origin}`);

    for (const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(script[1]);
      } catch (error) {
        failures.push(`${label} has invalid JSON-LD: ${error.message}`);
      }
    }

    if (noindex) {
      if (canonical && sitemapUrls.has(canonical)) failures.push(`${label} is noindex but appears in the sitemap`);
      continue;
    }

    if (h1Count !== 1) failures.push(`${label} has ${h1Count} h1 elements; expected 1`);
    if (title.length < 25 || title.length > 70) failures.push(`${label} title length is ${title.length}; expected 25-70`);
    if (description.length < 100 || description.length > 180) failures.push(`${label} description length is ${description.length}; expected 100-180`);
    if (!/<script type="application\/ld\+json">/i.test(html)) failures.push(`${label} has no JSON-LD entity graph`);

    if (canonical) {
      if (canonicalUrls.has(canonical)) failures.push(`${label} duplicates canonical ${canonical}`);
      canonicalUrls.add(canonical);
      if (!sitemapUrls.has(canonical)) failures.push(`${label} canonical is missing from the sitemap: ${canonical}`);
    }
    if (titles.has(title)) failures.push(`${label} duplicates title used by ${titles.get(title)}`);
    else titles.set(title, label);
    if (descriptions.has(description)) failures.push(`${label} duplicates description used by ${descriptions.get(description)}`);
    else descriptions.set(description, label);
  }

  for (const url of sitemapUrls) {
    if (!canonicalUrls.has(url)) failures.push(`${site.app} sitemap URL has no indexable canonical page: ${url}`);
  }

  const robots = await readFile(join("apps", site.app, "public", "robots.txt"), "utf8");
  if (!robots.includes(`Sitemap: ${site.origin}/sitemap-index.xml`)) {
    failures.push(`${site.app} robots.txt does not advertise its canonical sitemap`);
  }
}

if (failures.length) {
  console.error("SEO validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("SEO validation passed for both production builds.");

