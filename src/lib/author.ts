// Single author for the site. Edit the bio here — it shows on every post, the
// author page, and in article structured data.
export const AUTHOR = {
	name: "Ray",
	slug: "ray",
	avatar: "/authors/default.svg",
	bio: "Ray runs Bull or Bear and writes about Indian personal finance, markets, and the business stories behind your money.",
	url: "/author/ray/",
};

// Older posts (and the auto-posting agent) used the desk byline.
export const LEGACY_AUTHOR_NAMES = ["Bull or Bear Blogs"];

// Categories merged into others; old slugs keep resolving so posts that still
// use them build, and _redirects sends the old URLs to the new ones.
export const MERGED_CATEGORIES: Record<string, string> = {
	finance: "money",
	"personal-finance": "money",
	ai: "tech",
};
