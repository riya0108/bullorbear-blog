#!/usr/bin/env node
/**
 * Guards against posts (usually pushed by the automated Supabase posting
 * agent) that ship their own inline <style> block with hardcoded colors
 * instead of the site's theme tokens (--color-ink, --color-surface-card,
 * etc. from src/styles/global.css). That pattern renders fine in whichever
 * mode it was designed for, then goes unreadable in the other mode — e.g.
 * near-black text on a near-black dark-mode canvas.
 *
 * Run: npm run lint:posts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const POSTS_DIR = join(import.meta.dirname, "..", "src", "content", "posts");

const HEX_COLOR = /#[0-9a-fA-F]{3,8}\b/g;
const RAW_RGB = /\brgba?\(\s*\d/g;
const ROOT_BLOCK = /:root\s*\{/;
// var(--token, #fallback) is the sanctioned pattern (see htmlBuilder.ts in the
// content-team repo): the hex only ever renders when the site's own token is
// undefined, and disappears entirely once the var() resolves against
// src/styles/global.css. Strip these fallback expressions before scanning so they
// don't get flagged as hardcoded colors — only hex/rgb used OUTSIDE a var() call
// (i.e. actually hardcoded) should trip this lint.
const VAR_CALL = /var\([^)]*\)/g;

function extractStyleBlocks(source) {
	const blocks = [];
	const re = /<style[^>]*>([\s\S]*?)<\/style>/g;
	let m;
	while ((m = re.exec(source))) {
		blocks.push(m[1]);
	}
	return blocks;
}

function checkFile(filePath) {
	const source = readFileSync(filePath, "utf8");
	const styleBlocks = extractStyleBlocks(source);
	if (styleBlocks.length === 0) return [];

	const issues = [];
	for (const block of styleBlocks) {
		if (ROOT_BLOCK.test(block)) {
			issues.push(
				"defines its own `:root { ... }` block, which can clash with the site-wide tokens in src/styles/global.css",
			);
		}
		const withoutVarFallbacks = block.replace(VAR_CALL, "");
		const hexMatches = withoutVarFallbacks.match(HEX_COLOR) ?? [];
		if (hexMatches.length > 0) {
			const sample = [...new Set(hexMatches)].slice(0, 6).join(", ");
			issues.push(
				`hardcodes ${hexMatches.length} hex color(s) instead of theme tokens (e.g. ${sample}) — these stay fixed across light/dark mode instead of adapting`,
			);
		}
		const rgbMatches = withoutVarFallbacks.match(RAW_RGB) ?? [];
		if (rgbMatches.length > 0) {
			issues.push(
				`hardcodes ${rgbMatches.length} raw rgb()/rgba() color(s) instead of theme tokens`,
			);
		}
	}
	return issues;
}

function main() {
	const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
	let failed = false;

	for (const file of files) {
		const issues = checkFile(join(POSTS_DIR, file));
		if (issues.length > 0) {
			failed = true;
			console.error(`\n✗ src/content/posts/${file}`);
			for (const issue of issues) {
				console.error(`  - ${issue}`);
			}
		}
	}

	if (failed) {
		console.error(
			"\nFix: use the site's CSS custom properties instead of literal colors —\n" +
				"var(--color-ink), var(--color-body), var(--color-mute), var(--color-surface-card),\n" +
				"var(--color-surface-dark), var(--color-on-dark), var(--color-hairline), var(--color-primary),\n" +
				"var(--color-canvas). These are defined in src/styles/global.css and already flip with\n" +
				"the site's .dark class, so they always adapt to the reader's theme. See\n" +
				"src/components/FlipRevealGrid.astro for a reference implementation of the same\n" +
				"flip-card / dark-panel pattern done correctly.\n",
		);
		process.exit(1);
	}

	console.log(`✓ ${files.length} post(s) checked, no hardcoded theme colors found`);
}

main();
