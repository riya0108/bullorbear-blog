import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { appendComment, listComments, type SheetsConfig } from '../../lib/googleSheets';

export const prerender = false;

const MAX_NAME_LENGTH = 80;
const MAX_COMMENT_LENGTH = 2000;

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
	if (!slug) return json({ error: 'Missing slug' }, 400);

	const config = getSheetsConfig();
	if (!config) return json({ comments: [] });

	try {
		const comments = await listComments(config, slug);
		return json({
			comments: comments.map((c) => ({ name: c.name, comment: c.comment, timestamp: c.timestamp })),
		});
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to load comments' }, 502);
	}
};

export const POST: APIRoute = async ({ request }) => {
	const config = getSheetsConfig();
	if (!config) return json({ error: 'Comments are not configured' }, 503);

	const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
	const { success } = await env.COMMENTS_RATE_LIMITER.limit({ key: ip });
	if (!success) return json({ error: 'Too many comments — please slow down.' }, 429);

	let body: { slug?: string; name?: string; comment?: string; website?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, 400);
	}

	// Honeypot: real visitors never fill this hidden field, bots often do.
	if (body.website) return json({ ok: true });

	const slug = body.slug?.trim();
	const name = body.name?.trim();
	const comment = body.comment?.trim();

	if (!slug || !name || !comment) return json({ error: 'Missing required fields' }, 400);
	if (name.length > MAX_NAME_LENGTH || comment.length > MAX_COMMENT_LENGTH) {
		return json({ error: 'Input too long' }, 400);
	}

	const timestamp = new Date().toISOString();

	try {
		await appendComment(config, { timestamp, slug, name, comment });
		return json({ name, comment, timestamp }, 201);
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to save comment' }, 502);
	}
};
