/**
 * Literal Tailwind class strings per category, kept in one place so the
 * v4 content scanner (which is text-based, not JS-aware) can always see
 * the full utility names — building them with template strings would hide
 * them from the scanner and silently drop the styles.
 */
export const categoryDot: Record<string, string> = {
	"cat-ai": "bg-cat-ai dark:bg-cat-ai-dark",
	"cat-tech": "bg-cat-tech dark:bg-cat-tech-dark",
	"cat-money": "bg-cat-money dark:bg-cat-money-dark",
	"cat-finance": "bg-cat-finance dark:bg-cat-finance-dark",
	"cat-politics": "bg-cat-politics dark:bg-cat-politics-dark",
	"cat-personal-finance": "bg-cat-personal-finance dark:bg-cat-personal-finance-dark",
	"cat-world": "bg-cat-world dark:bg-cat-world-dark",
	"cat-business": "bg-cat-business dark:bg-cat-business-dark",
	"cat-lifestyle": "bg-cat-lifestyle dark:bg-cat-lifestyle-dark",
};

export const categoryText: Record<string, string> = {
	"cat-ai": "text-cat-ai dark:text-cat-ai-dark",
	"cat-tech": "text-cat-tech dark:text-cat-tech-dark",
	"cat-money": "text-cat-money dark:text-cat-money-dark",
	"cat-finance": "text-cat-finance dark:text-cat-finance-dark",
	"cat-politics": "text-cat-politics dark:text-cat-politics-dark",
	"cat-personal-finance": "text-cat-personal-finance dark:text-cat-personal-finance-dark",
	"cat-world": "text-cat-world dark:text-cat-world-dark",
	"cat-business": "text-cat-business dark:text-cat-business-dark",
	"cat-lifestyle": "text-cat-lifestyle dark:text-cat-lifestyle-dark",
};

export function dotClass(accentColor: string): string {
	return categoryDot[accentColor] ?? "bg-ink";
}

export function textClass(accentColor: string): string {
	return categoryText[accentColor] ?? "text-ink";
}
