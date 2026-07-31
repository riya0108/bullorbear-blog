export const categoryHex: Record<string, string> = {
	"cat-ai": "#7e238b",
	"cat-tech": "#3b5bdb",
	"cat-money": "#16a34a",
	"cat-finance": "#0f766e",
	"cat-politics": "#b45309",
	"cat-personal-finance": "#be185d",
	"cat-world": "#1d4ed8",
	"cat-business": "#a16207",
	"cat-lifestyle": "#c026d3",
};

export function hashSeed(input: string): number {
	let h = 0;
	for (let i = 0; i < input.length; i++) {
		h = (h * 31 + input.charCodeAt(i)) >>> 0;
	}
	return h;
}

export function seededRandom(seed: number, index: number): number {
	const x = Math.sin(seed + index * 999.9) * 10000;
	return x - Math.floor(x);
}
