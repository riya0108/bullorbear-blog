export interface Language {
	code: string;
	label: string;
	/** BCP-47 tag used to pick a matching speechSynthesis voice. */
	speechLang: string;
}

export const languages: Language[] = [
	{ code: "en", label: "English", speechLang: "en-US" },
	{ code: "hi", label: "हिन्दी", speechLang: "hi-IN" },
	{ code: "ta", label: "தமிழ்", speechLang: "ta-IN" },
	{ code: "te", label: "తెలుగు", speechLang: "te-IN" },
	{ code: "bn", label: "বাংলা", speechLang: "bn-IN" },
	{ code: "mr", label: "मराठी", speechLang: "mr-IN" },
	{ code: "es", label: "Español", speechLang: "es-ES" },
	{ code: "fr", label: "Français", speechLang: "fr-FR" },
	{ code: "de", label: "Deutsch", speechLang: "de-DE" },
	{ code: "ar", label: "العربية", speechLang: "ar-SA" },
	{ code: "zh-CN", label: "中文", speechLang: "zh-CN" },
	{ code: "ja", label: "日本語", speechLang: "ja-JP" },
	{ code: "ru", label: "Русский", speechLang: "ru-RU" },
	{ code: "pt", label: "Português", speechLang: "pt-PT" },
];

export function getGoogTransCookie(): string | null {
	const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
}

/** The language currently applied to the page via the googtrans cookie. */
export function currentPageLanguage(): string {
	const cookie = getGoogTransCookie();
	if (!cookie) return "en";
	const parts = cookie.split("/").filter(Boolean);
	return parts[1] ?? "en";
}

/** Google Translate exposes a hidden <select class="goog-te-combo"> once its
 * widget has initialized; driving it directly re-translates the page in
 * place instead of requiring a full reload. */
function findGoogleCombo(): HTMLSelectElement | null {
	return document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
}

function waitForGoogleCombo(timeoutMs = 8000): Promise<HTMLSelectElement | null> {
	return new Promise((resolve) => {
		const existing = findGoogleCombo();
		if (existing) {
			resolve(existing);
			return;
		}
		const start = Date.now();
		const poll = window.setInterval(() => {
			const combo = findGoogleCombo();
			if (combo || Date.now() - start > timeoutMs) {
				window.clearInterval(poll);
				resolve(combo);
			}
		}, 100);
	});
}

/** Google Translate adds this class to <html> once it has started applying a
 * translation. It flips well before a long page's text nodes have all
 * actually been rewritten, so it's a "the switch registered" signal rather
 * than a "the swap is finished" one — callers that need the latter should
 * use `waitForTranslationSettle` below instead. */
export function isPageTranslated(): boolean {
	const root = document.documentElement.classList;
	return root.contains("translated-ltr") || root.contains("translated-rtl");
}

/** Waits for the page to actually reach the requested language state, then
 * for the DOM text swap to finish landing. Driving Google Translate's hidden
 * control is asynchronous, and on a long article the translated-ltr/rtl
 * class flips almost immediately while the actual text can take anywhere
 * from a couple seconds to 15+ seconds to fully replace (Google rewrites it
 * node by node, streaming translations back). Without this wait, callers
 * (the language switcher's loading state, the "listen to article" feature)
 * would act as though translation was instant and either look broken or read
 * stale-language text. Rather than guess a fixed delay, this watches DOM
 * mutations under <body> and resolves once they've gone quiet for a short
 * debounce window — i.e. once the swap has actually stopped happening. */
export async function waitForTranslationSettle(targetLang: string, timeoutMs = 20000): Promise<void> {
	if (targetLang === "en" && !isPageTranslated()) return;
	const targetTranslated = targetLang !== "en";
	const deadline = Date.now() + timeoutMs;

	while (isPageTranslated() !== targetTranslated && Date.now() < deadline) {
		await new Promise((resolve) => window.setTimeout(resolve, 150));
	}

	await new Promise<void>((resolve) => {
		const DEBOUNCE_MS = 700;
		// Deliberately does NOT arm the debounce until the first real
		// mutation is seen. Google can take several seconds just to start
		// rewriting a long page, and silence *before* that start looks
		// identical to silence *after* it finishes — arming eagerly resolved
		// this before translation had even begun.
		let settleTimer: ReturnType<typeof window.setTimeout> | null = null;
		let hardTimeout: ReturnType<typeof window.setTimeout>;
		const finish = () => {
			observer.disconnect();
			if (settleTimer !== null) window.clearTimeout(settleTimer);
			window.clearTimeout(hardTimeout);
			resolve();
		};
		const observer = new MutationObserver(() => {
			if (settleTimer !== null) window.clearTimeout(settleTimer);
			settleTimer = window.setTimeout(finish, DEBOUNCE_MS);
		});
		observer.observe(document.body, { childList: true, characterData: true, subtree: true });
		hardTimeout = window.setTimeout(finish, Math.max(0, deadline - Date.now()));
	});
}

/** Sets the googtrans cookie (so later page loads land pre-translated) and
 * applies the language to the current page immediately via Google
 * Translate's own hidden control, avoiding a full reload. Falls back to a
 * reload only if the widget never finished initializing (e.g. still loading,
 * or blocked). Resolves once the translation has actually settled (see
 * `waitForTranslationSettle`) — callers can use this to keep the UI locked
 * for the duration, which also prevents firing a second switch while one is
 * still in flight (driving the hidden combo mid-translation left it in an
 * inconsistent state where the visible text stopped matching the selected
 * language). */
export async function setPageLanguage(lang: string) {
	const hostname = window.location.hostname;
	if (lang === "en") {
		document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
	} else {
		document.cookie = `googtrans=/en/${lang}; path=/`;
		document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname}`;
	}

	const combo = await waitForGoogleCombo();
	if (!combo) {
		window.location.reload();
		return;
	}
	// The combo has no "English" option — setting it back to "" is Google's
	// own mechanism for restoring the original, untranslated text.
	combo.value = lang === "en" ? "" : lang;
	combo.dispatchEvent(new Event("change"));
	await waitForTranslationSettle(lang);
}
