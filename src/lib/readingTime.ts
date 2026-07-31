const WORDS_PER_MINUTE = 200;

export function readingTime(body: string | undefined): { minutes: number; label: string } {
	const text = (body ?? "").replace(/[`*_#>\-\[\]()!]/g, " ");
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
	return { minutes, label: `${minutes} min read` };
}
