import { getCollection } from "astro:content";
import { laceSite } from "../site.config";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET() {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const items = posts.map((post) => {
    const url = `${laceSite.url}/blog/${post.id}/`;
    return `<item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.data.seoDescription ?? post.data.description)}</description>
      <category>${escapeXml(post.data.category)}</category>
      <dc:creator>${escapeXml(post.data.author)}</dc:creator>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${laceSite.name} Enterprise AI Engineering Blog</title>
    <link>${laceSite.url}/blog/</link>
    <description>Engineering and product writing about governed enterprise AI.</description>
    <language>en-us</language>
    <lastBuildDate>${(posts[0]?.data.updated ?? posts[0]?.data.date ?? new Date(0)).toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

