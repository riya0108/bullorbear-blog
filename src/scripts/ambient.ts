function initAmbient() {
	const layer = document.querySelector<HTMLElement>(".bg-ambient");
	const grid = document.querySelector<HTMLElement>(".bg-ambient__grid");
	const spotlight = document.querySelector<HTMLElement>(".bg-ambient__spotlight");
	if (!layer || !grid || !spotlight) return;

	const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const canHover = window.matchMedia("(hover: hover)").matches;
	if (prefersReduced || !canHover) return;

	// Anything that reads as "content" rather than blank canvas — the dot
	// cutout below excludes each of these elements' boxes so the grid/
	// spotlight never renders under text, images, or cards.
	const CONTENT_SELECTOR =
		"h1, h2, h3, h4, h5, h6, p, li, blockquote, img, svg, figure, dt, dd, pre, table, button, input, textarea, select, [class*='bg-surface'], [class*='bg-secondary'], [class*='bg-canvas'], [class*='bg-primary']";

	let maskRaf = 0;

	function updateContentMask() {
		maskRaf = 0;
		const w = window.innerWidth;
		const h = window.innerHeight;
		const pad = 6;
		// Punch real alpha holes via an evenodd path (outer rect + each cutout
		// wound the same way) rather than opaque black rects — legacy
		// -webkit-mask-composite composites on alpha, not luminance, so a
		// "black" rect (still alpha 1) would not read as a hole there.
		let d = `M0,0H${w}V${h}H0Z`;

		document.querySelectorAll<HTMLElement>(CONTENT_SELECTOR).forEach((el) => {
			const r = el.getBoundingClientRect();
			if (r.width <= 0 || r.height <= 0) return;
			if (r.bottom < -100 || r.top > h + 100 || r.right < -100 || r.left > w + 100) return;
			const x = Math.round(r.left - pad);
			const y = Math.round(r.top - pad);
			const rw = Math.round(r.width + pad * 2);
			const rh = Math.round(r.height + pad * 2);
			d += `M${x},${y}H${x + rw}V${y + rh}H${x}Z`;
		});

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="white" fill-rule="evenodd"/></svg>`;
		const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
		grid!.style.setProperty("--content-mask", uri);
		spotlight!.style.setProperty("--content-mask", uri);
	}

	function scheduleMaskUpdate() {
		if (!maskRaf) maskRaf = requestAnimationFrame(updateContentMask);
	}

	updateContentMask();
	window.addEventListener("scroll", scheduleMaskUpdate, { passive: true });
	window.addEventListener("resize", scheduleMaskUpdate);
	window.addEventListener("load", scheduleMaskUpdate);

	let raf = 0;
	let pending: { x: number; y: number } | null = null;

	function apply() {
		raf = 0;
		if (!pending) return;
		layer!.style.setProperty("--mx", `${pending.x}%`);
		layer!.style.setProperty("--my", `${pending.y}%`);
		pending = null;
	}

	window.addEventListener(
		"pointermove",
		(e) => {
			pending = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 };
			if (!raf) raf = requestAnimationFrame(apply);
			spotlight!.style.setProperty("--spotlight-opacity", "1");
		},
		{ passive: true },
	);

	window.addEventListener("pointerleave", () => {
		spotlight!.style.setProperty("--spotlight-opacity", "0");
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAmbient);
} else {
	initAmbient();
}
