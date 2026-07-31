/** Strip Markdown/MDX syntax down to plain, speakable text for the TTS listen feature. */
export function stripMarkdown(body: string | undefined): string {
	if (!body) return "";
	return body
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/^---[\s\S]*?---/, "")
		.replace(/!\[.*?\]\(.*?\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/[*_~]{1,3}/g, "")
		.replace(/^>\s?/gm, "")
		.replace(/^[-*+]\s+/gm, "")
		.replace(/\n{2,}/g, ". ")
		.replace(/\s+/g, " ")
		.trim();
}
