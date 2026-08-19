import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { appendVote, getVoteCounts, type SheetsConfig } from '../../lib/googleSheets';

export const prerender = false;

const MAX_ID_LENGTH = 200;

function getSheetsConfig(): SheetsConfig | null {
	const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
	const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
	const sheetId = env.GOOGLE_SHEET_ID;
	if (!clientEmail || !privateKey || !sheetId) return null;
	return { clientEmail, privateKey, sheetId };
}

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const GET: APIRoute = async ({ url }) => {
	const slug = url.searchParams.get('slug');
	const pollId = url.searchParams.get('pollId');
	if (!slug || !pollId) return json({ error: 'Missing slug or pollId' }, 400);

	const config = getSheetsConfig();
	if (!config) return json({ counts: [] });

	try {
		const counts = await getVoteCounts(config, slug, pollId);
		return json({ counts });
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to load votes' }, 502);
	}
};

export const POST: APIRoute = async ({ request }) => {
	const config = getSheetsConfig();
	if (!config) return json({ error: 'Polls are not configured' }, 503);

	const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
	const { success } = await env.POLL_RATE_LIMITER.limit({ key: ip });
	if (!success) return json({ error: 'Too many votes — please slow down.' }, 429);

	let body: { slug?: string; pollId?: string; optionIndex?: number };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, 400);
	}

	const slug = body.slug?.trim();
	const pollId = body.pollId?.trim();
	const optionIndex = body.optionIndex;

	if (!slug || !pollId || typeof optionIndex !== 'number' || !Number.isInteger(optionIndex) || optionIndex < 0) {
		return json({ error: 'Missing or invalid fields' }, 400);
	}
	if (slug.length > MAX_ID_LENGTH || pollId.length > MAX_ID_LENGTH) {
		return json({ error: 'Input too long' }, 400);
	}

	const timestamp = new Date().toISOString();

	try {
		await appendVote(config, { timestamp, slug, pollId, optionIndex });
		const counts = await getVoteCounts(config, slug, pollId);
		return json({ counts }, 201);
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to record vote' }, 502);
	}
};
