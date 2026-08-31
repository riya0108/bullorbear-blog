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

/** Sets the googtrans cookie (so later page loads land pre-translated) and
 * applies the language to the current page immediately via Google
 * Translate's own hidden control, avoiding a full reload. Falls back to a
 * reload only if the widget never finished initializing (e.g. still loading,
 * or blocked). */
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
}
