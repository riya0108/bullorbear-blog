function initReveal() {
	const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
	if (targets.length === 0) return;

	const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (prefersReduced) {
		targets.forEach((el) => el.classList.add("is-visible"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const el = entry.target as HTMLElement;
					const delay = el.dataset.revealDelay ?? "0";
					el.style.transitionDelay = `${delay}ms`;
					el.classList.add("is-visible");
					observer.unobserve(el);
				}
			}
		},
		{ threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
	);

	targets.forEach((el) => observer.observe(el));
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initReveal);
} else {
	initReveal();
}
