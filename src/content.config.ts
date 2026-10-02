import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import { AUTHOR, LEGACY_AUTHOR_NAMES, MERGED_CATEGORIES } from "./lib/author";

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
		seoTitle: z.string().optional(),
		description: z.string(),
		category: z.preprocess(
			(slug) => (typeof slug === "string" ? (MERGED_CATEGORIES[slug] ?? slug) : slug),
			reference("categories"),
		),
		tags: z.array(z.string()).default([]),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z
			.preprocess(
				(a) =>
					!a || LEGACY_AUTHOR_NAMES.includes((a as { name?: string }).name ?? "") ? AUTHOR : a,
				z.object({
					name: z.string(),
					avatar: z.string().default("/authors/default.svg"),
					bio: z.string().default(""),
				}),
			)
			.transform((a) => (a.name === AUTHOR.name ? { ...a, bio: a.bio || AUTHOR.bio } : a)),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().default(""),
		featured: z.boolean().default(false),
		trending: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

export const collections = { categories, posts };
