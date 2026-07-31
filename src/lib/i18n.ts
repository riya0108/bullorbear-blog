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

/** Sets the googtrans cookie for the given language and reloads the page. */
export function setPageLanguage(lang: string) {
	const hostname = window.location.hostname;
	if (lang === "en") {
		document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
	} else {
		document.cookie = `googtrans=/en/${lang}; path=/`;
		document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname}`;
	}
	window.location.reload();
}
