import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const categories = defineCollection({
	loader: file("src/content/categories.json"),
	schema: z.object({
		slug: z.string(),
		name: z.string(),
		description: z.string(),
		icon: z.string(),
		accentColor: z.string(),
	}),
});

const posts = defineCollection({
	loader: glob({ base: "./src/content/posts", pattern: "**/*.mdx" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: reference("categories"),
		tags: z.array(z.string()).default([]),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z.object({
			name: z.string(),
			avatar: z.string().default("/authors/default.svg"),
			bio: z.string().default(""),
		}),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().default(""),
		featured: z.boolean().default(false),
		trending: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

export const collections = { categories, posts };
