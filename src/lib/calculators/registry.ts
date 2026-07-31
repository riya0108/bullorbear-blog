export type CalculatorCategory = "Investment" | "Loans" | "Tax & Salary" | "Trading";

export interface CalculatorMeta {
	slug: string;
	name: string;
	category: CalculatorCategory;
	description: string;
}

export const CALCULATORS: CalculatorMeta[] = [
	// Investment
	{ slug: "sip-calculator", name: "SIP Calculator", category: "Investment", description: "Project the future value of your monthly SIP investments." },
	{ slug: "step-up-sip-calculator", name: "Step-Up SIP Calculator", category: "Investment", description: "Model a SIP where your monthly investment rises every year." },
	{ slug: "lumpsum-calculator", name: "Lumpsum Calculator", category: "Investment", description: "Estimate returns on a one-time investment over time." },
	{ slug: "swp-calculator", name: "SWP Calculator", category: "Investment", description: "Plan fixed monthly withdrawals from an existing corpus." },
	{ slug: "mf-returns-calculator", name: "MF Returns Calculator", category: "Investment", description: "Calculate absolute and annualised (CAGR) mutual fund returns." },
	{ slug: "ppf-calculator", name: "PPF Calculator", category: "Investment", description: "Estimate your Public Provident Fund maturity value." },
	{ slug: "rd-calculator", name: "RD Calculator", category: "Investment", description: "Work out the maturity value of a recurring deposit." },
	{ slug: "fd-calculator", name: "FD Calculator", category: "Investment", description: "Calculate fixed deposit maturity value with compounding." },
	{ slug: "epf-calculator", name: "EPF Calculator", category: "Investment", description: "Project your EPF corpus at retirement." },
	{ slug: "ssy-calculator", name: "SSY Calculator", category: "Investment", description: "Estimate Sukanya Samriddhi Yojana maturity value." },
	{ slug: "roi-calculator", name: "ROI Calculator", category: "Investment", description: "Work out absolute and annualised return on any investment." },

	// Loans
	{ slug: "emi-calculator", name: "EMI Calculator", category: "Loans", description: "Calculate EMI, total interest, and amortisation for any loan." },
	{ slug: "home-loan-emi-calculator", name: "Home Loan EMI Calculator", category: "Loans", description: "Calculate your monthly home loan instalment and interest cost." },
	{ slug: "car-loan-emi-calculator", name: "Car Loan EMI Calculator", category: "Loans", description: "Calculate your monthly car loan instalment and interest cost." },

	// Tax & Salary
	{ slug: "income-tax-calculator", name: "Income Tax Calculator", category: "Tax & Salary", description: "Compare tax liability under the old and new regimes (FY 2025-26)." },
	{ slug: "hra-calculator", name: "HRA Calculator", category: "Tax & Salary", description: "Calculate your exempt HRA under Section 10(13A)." },
	{ slug: "salary-calculator", name: "Salary Calculator", category: "Tax & Salary", description: "Break down CTC into take-home, PF, and other components." },
	{ slug: "gst-calculator", name: "GST Calculator", category: "Tax & Salary", description: "Add or remove GST from any amount instantly." },
	{ slug: "tds-calculator", name: "TDS Calculator", category: "Tax & Salary", description: "Calculate TDS deduction for common payment sections." },

	// Trading
	{ slug: "brokerage-calculator", name: "Brokerage Calculator", category: "Trading", description: "Estimate brokerage, STT, and other trade charges." },
	{ slug: "margin-calculator", name: "Margin Calculator", category: "Trading", description: "Calculate the margin required for a leveraged trade." },
	{ slug: "stock-average-calculator", name: "Stock Average Calculator", category: "Trading", description: "Find your average buy price across multiple purchases." },
];

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = ["Investment", "Loans", "Tax & Salary", "Trading"];

export function getCalculatorMeta(slug: string): CalculatorMeta | undefined {
	return CALCULATORS.find((c) => c.slug === slug);
}
