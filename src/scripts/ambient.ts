function initAmbient() {
	const layer = document.querySelector<HTMLElement>(".bg-ambient");
	const spotlight = document.querySelector<HTMLElement>(".bg-ambient__spotlight");
	if (!layer || !spotlight) return;

	const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const canHover = window.matchMedia("(hover: hover)").matches;
	if (prefersReduced || !canHover) return;

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
