const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_RANGE = 'Sheet1!A:E';
const POLL_SHEET_NAME = 'PollVotes';
const POLL_SHEET_RANGE = `${POLL_SHEET_NAME}!A:D`;

export interface SheetsConfig {
	clientEmail: string;
	privateKey: string;
	sheetId: string;
}

export interface CommentRow {
	timestamp: string;
	slug: string;
	name: string;
	comment: string;
	hidden: string;
}

function base64UrlEncode(input: ArrayBuffer | string): string {
	const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function normalizePemKey(pem: string): string {
	let value = pem.trim();
	if (value.startsWith('"') && value.endsWith('"')) {
		value = value.slice(1, -1);
	}
	// .dev.vars / some secret stores don't unescape literal "\n" sequences.
	return value.replace(/\\n/g, '\n');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
	const base64 = normalizePemKey(pem)
		.replace(/-----BEGIN PRIVATE KEY-----/, '')
		.replace(/-----END PRIVATE KEY-----/, '')
		.replace(/\s+/g, '');
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes.buffer;
}

async function getAccessToken({ clientEmail, privateKey }: SheetsConfig): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const header = { alg: 'RS256', typ: 'JWT' };
	const claims = {
		iss: clientEmail,
		scope: 'https://www.googleapis.com/auth/spreadsheets',
		aud: GOOGLE_TOKEN_URL,
		exp: now + 3600,
		iat: now,
	};

	const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;

	const key = await crypto.subtle.importKey(
		'pkcs8',
		pemToArrayBuffer(privateKey),
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
	const jwt = `${signingInput}.${base64UrlEncode(signature)}`;

	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: jwt,
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to get Google access token: ${response.status} ${await response.text()}`);
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

export async function listComments(config: SheetsConfig, slug: string): Promise<CommentRow[]> {
	const token = await getAccessToken(config);
	const url = `${SHEETS_API_BASE}/${config.sheetId}/values/${encodeURIComponent(SHEET_RANGE)}`;
	const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

	if (!response.ok) {
		throw new Error(`Failed to list comments: ${response.status} ${await response.text()}`);
	}

	const data = (await response.json()) as { values?: string[][] };
	const [, ...rows] = data.values ?? [];

	return rows
		.map(([timestamp, rowSlug, name, comment, hidden]) => ({
			timestamp: timestamp ?? '',
			slug: rowSlug ?? '',
			name: name ?? '',
			comment: comment ?? '',
			hidden: hidden ?? '',
		}))
		.filter((row) => row.slug === slug && row.hidden.toUpperCase() !== 'TRUE');
}

export async function appendComment(
	config: SheetsConfig,
	row: Pick<CommentRow, 'timestamp' | 'slug' | 'name' | 'comment'>,
): Promise<void> {
	const token = await getAccessToken(config);
	const url = `${SHEETS_API_BASE}/${config.sheetId}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			values: [[row.timestamp, row.slug, row.name, row.comment, 'FALSE']],
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to append comment: ${response.status} ${await response.text()}`);
	}
}

export interface PollVoteRow {
	timestamp: string;
	slug: string;
	pollId: string;
	optionIndex: number;
}

// Sheets 400s on an unknown tab name rather than returning an empty range,
// so a brand-new spreadsheet needs the "PollVotes" tab created (with a
// header row) before the first read or write will succeed.
async function ensurePollSheetExists(config: SheetsConfig, token: string): Promise<void> {
	const metaUrl = `${SHEETS_API_BASE}/${config.sheetId}?fields=sheets.properties.title`;
	const metaResponse = await fetch(metaUrl, { headers: { Authorization: `Bearer ${token}` } });
	if (!metaResponse.ok) {
		throw new Error(`Failed to read spreadsheet metadata: ${metaResponse.status} ${await metaResponse.text()}`);
	}
	const meta = (await metaResponse.json()) as { sheets?: { properties: { title: string } }[] };
	const exists = (meta.sheets ?? []).some((sheet) => sheet.properties.title === POLL_SHEET_NAME);
	if (exists) return;

	const batchUrl = `${SHEETS_API_BASE}/${config.sheetId}:batchUpdate`;
	const batchResponse = await fetch(batchUrl, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ requests: [{ addSheet: { properties: { title: POLL_SHEET_NAME } } }] }),
	});
	if (!batchResponse.ok) {
		throw new Error(`Failed to create PollVotes sheet: ${batchResponse.status} ${await batchResponse.text()}`);
	}

	const headerUrl = `${SHEETS_API_BASE}/${config.sheetId}/values/${encodeURIComponent(`${POLL_SHEET_NAME}!A1:D1`)}?valueInputOption=RAW`;
	await fetch(headerUrl, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ values: [['timestamp', 'slug', 'pollId', 'optionIndex']] }),
	});
}

export async function getVoteCounts(config: SheetsConfig, slug: string, pollId: string): Promise<number[]> {
	const token = await getAccessToken(config);
	const url = `${SHEETS_API_BASE}/${config.sheetId}/values/${encodeURIComponent(POLL_SHEET_RANGE)}`;
	const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

	if (!response.ok) {
		// Tab doesn't exist yet means nobody has voted on anything yet.
		if (response.status === 400) return [];
		throw new Error(`Failed to list votes: ${response.status} ${await response.text()}`);
	}

	const data = (await response.json()) as { values?: string[][] };
	const [, ...rows] = data.values ?? [];

	const counts: number[] = [];
	for (const [, rowSlug, rowPollId, optionIndexRaw] of rows) {
		if (rowSlug !== slug || rowPollId !== pollId) continue;
		const index = Number(optionIndexRaw);
		if (!Number.isInteger(index) || index < 0) continue;
		counts[index] = (counts[index] ?? 0) + 1;
	}
	return counts;
}

export async function appendVote(config: SheetsConfig, row: PollVoteRow): Promise<void> {
	const token = await getAccessToken(config);
	await ensurePollSheetExists(config, token);

	const url = `${SHEETS_API_BASE}/${config.sheetId}/values/${encodeURIComponent(POLL_SHEET_RANGE)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			values: [[row.timestamp, row.slug, row.pollId, String(row.optionIndex)]],
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to append vote: ${response.status} ${await response.text()}`);
	}
}
