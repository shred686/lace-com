import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    category: z.enum(["Retrieval", "Knowledge Graph", "Agents", "App Builder", "Deployment", "Product"]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default("LACE Engineering"),
    featured: z.boolean().default(false)
  })
});

export const collections = { blog };
