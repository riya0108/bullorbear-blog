export interface HiddenGem {
	name: string;
	url: string;
	tagline: string;
	description: string;
	whyUnderrated: string;
	tags: string[];
}

export const hiddenGems: HiddenGem[] = [
	{
		name: "Generate Real Invoice",
		url: "https://generaterealinvoice.com",
		tagline: "A live invoice & receipt editor with nothing to unlock",
		description:
			"Type your business details and line items and watch the invoice update on screen instantly — drag items to reorder, resize your logo, pick from 21 templates, and export a PDF, PNG, or JPEG. There's a real GST/CGST/SGST/VAT tax engine underneath, and it can even read an old paper invoice or receipt via AI and turn it into editable fields.",
		whyUnderrated:
			"Nearly every \"free invoice generator\" gates the actual PDF behind a signup, a monthly cap, or a watermark. This one doesn't ask for any of it — no account, no login, no upgrade prompt — which is exactly why it never shows up next to the big-name invoicing suites.",
		tags: ["No signup", "No watermark", "Free forever"],
	},
	{
		name: "Insta Reel Thumbnails",
		url: "https://thumbnails-insta.netlify.app",
		tagline: "Turns a reel topic into a click-worthy 1080×1920 cover",
		description:
			"Type your reel's topic or script and it generates a full cover design — hook text, layout, and typography composed over an AI-generated background. Pick a style like Clean Editorial, Dramatic News, or Retro Neon, drop in a creator or product photo with automatic background removal, then drag, resize, and layer everything on an interactive canvas.",
		whyUnderrated:
			"Most cover-making tools hand you a blank template and leave the actual design work to you. This one writes the hook and composes the layout for you, so you're editing a finished cover instead of starting from a grid — and it's easy to miss since it lives outside the usual design-app names.",
		tags: ["No signup", "AI-generated", "Free forever"],
	},
	{
		name: "Why We Buy",
		url: "https://brand-psychology.bullorbear.in",
		tagline: "A scroll-through playbook on why you actually click 'buy'",
		description:
			"Eight case studies — Nike drops, luxury pricing, Apple keynotes, Starbucks, Zomato ratings, and more — each paired with a live simulation you interact with instead of just reading about. Watch a sneaker 'sell out' in real time, price the same T-shirt with and without a logo, or see how a rating alone changes whether you'd trust a restaurant. It builds a small personality profile from your choices as you go.",
		whyUnderrated:
			"Most explainers about marketing psychology just describe the tactic. This one makes you fall for it live, on real Indian brand examples, then shows you the trick immediately after — which makes it stick in a way a listicle never does.",
		tags: ["No signup", "Interactive", "Free forever"],
	},
	{
		name: "First ₹100 Investing Toolkit",
		url: "https://investing-toolkit.bullorbear.in",
		tagline: "A no-fluff starter kit for investing your first ₹100 in India",
		description:
			"A nine-step guided kit built specifically for Indian first-time investors: an investing roadmap, an emergency-fund calculator, a Mutual Fund vs ETF comparison, a SIP pre-flight checklist, a list of the mistakes that actually cost Gen Z investors money, a 50-term glossary, a risk-profile quiz, a 'should I trust this finfluencer' 10-point check, and a FOMO check before any impulse buy.",
		whyUnderrated:
			"Nearly every 'how to invest' guide jumps straight to picking a fund. This one forces the boring-but-critical steps first — KYC, emergency fund, spotting a pump-and-dump — and does it with interactive Indian-market tools instead of a wall of text.",
		tags: ["No signup", "India-focused", "Free forever"],
	},
];
