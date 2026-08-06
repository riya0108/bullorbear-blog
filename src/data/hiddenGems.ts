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
];
