import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { readingTime } from "../lib/readingTime";

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts", ({ data }) => !data.draft);

	const index = await Promise.all(
		posts.map(async (post) => {
			const category = await getEntry(post.data.category);
			return {
				title: post.data.title,
				description: post.data.description,
				url: `/${category?.data.slug}/${post.id}/`,
				category: category?.data.name ?? "",
				categorySlug: category?.data.slug ?? "",
				accentColor: category?.data.accentColor ?? "",
				tags: post.data.tags,
				author: post.data.author.name,
				pubDate: post.data.pubDate.toISOString(),
				readingTime: readingTime(post.body).label,
			};
		}),
	);

	return new Response(JSON.stringify(index), {
		headers: { "Content-Type": "application/json" },
	});
};
