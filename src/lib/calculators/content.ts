export interface CalculatorContent {
	intro: string;
	formula: string[];
	faqs: { q: string; a: string }[];
}

export const CALCULATOR_CONTENT: Record<string, CalculatorContent> = {
	"sip-calculator": {
		intro:
			"A Systematic Investment Plan (SIP) lets you invest a fixed amount into a mutual fund every month. This calculator projects the future value of your SIP using compounded monthly growth.",
		formula: [
			"FV = P × [ ((1+i)^n − 1) / i ] × (1+i)",
			"P = monthly investment, i = effective monthly rate = (1 + annual rate)^(1/12) − 1, n = number of months",
		],
		faqs: [
			{ q: "Does this account for expense ratio or exit load?", a: "No — it projects gross returns at your assumed annual rate. Actual fund returns are net of expense ratio, and exit load may apply on early withdrawal." },
			{ q: "Is the return rate guaranteed?", a: "No. Mutual fund returns are market-linked and not guaranteed — use a conservative rate for planning." },
		],
	},
	"step-up-sip-calculator": {
		intro:
			"A step-up (or top-up) SIP increases your monthly investment by a fixed percentage every year, helping your investments keep pace with rising income.",
		formula: [
			"Each year, monthly investment = starting investment × (1 + step-up %)^(year index)",
			"Future value is compounded month-on-month at the effective monthly rate = (1 + annual rate)^(1/12) − 1.",
		],
		faqs: [
			{ q: "Why does a step-up SIP build a larger corpus than a flat SIP?", a: "Because later, larger instalments still get invested and compounded for the remaining years, and your total invested amount is higher." },
		],
	},
	"lumpsum-calculator": {
		intro: "Estimate how a one-time investment can grow over time, assuming compounded annual returns.",
		formula: ["FV = P × (1 + r)^n", "P = principal, r = expected annual return, n = years"],
		faqs: [{ q: "Does this assume annual or monthly compounding?", a: "Annual compounding on the entered rate, matching how CAGR-based fund return figures are usually quoted." }],
	},
	"swp-calculator": {
		intro:
			"A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed amount from your investment every month while the rest stays invested and continues to grow.",
		formula: [
			"Each month: balance = (balance − withdrawal) × (1 + i), where i = effective monthly rate = (1 + annual rate)^(1/12) − 1",
			"Repeated for the number of months in your withdrawal period.",
		],
		faqs: [{ q: "What happens if I withdraw more than my corpus earns?", a: "Your balance will decline over time and can be exhausted before your target period ends — the calculator flags this." }],
	},
	"mf-returns-calculator": {
		intro: "Calculate both the absolute return and the annualised (CAGR) return on a mutual fund investment.",
		formula: ["Absolute return % = (Current value − Invested) ÷ Invested × 100", "CAGR % = [(Current value ÷ Invested)^(1/years) − 1] × 100"],
		faqs: [{ q: "When should I use CAGR instead of absolute return?", a: "CAGR is more meaningful for holding periods longer than a year, since it annualises the return for fair comparison across investments." }],
	},
	"ppf-calculator": {
		intro:
			"The Public Provident Fund (PPF) is a government-backed long-term savings scheme with a 15-year lock-in, EEE tax status, and interest revised quarterly by the government.",
		formula: ["Each year: balance = (balance + yearly deposit) × (1 + PPF rate)", "Assumes deposits are made at the start of each financial year, which earns the most interest."],
		faqs: [
			{ q: "What is the maximum yearly PPF investment?", a: "₹1.5 lakh per financial year, which also qualifies for Section 80C deduction under the old tax regime." },
			{ q: "Can I extend my PPF account after 15 years?", a: "Yes, in blocks of 5 years, with or without further contributions." },
		],
	},
	"rd-calculator": {
		intro: "A Recurring Deposit (RD) lets you save a fixed amount every month at a fixed interest rate, compounded quarterly.",
		formula: ["M = R × [(1+i)^n − 1] ÷ [1 − (1+i)^(−1/3)]", "R = monthly deposit, i = quarterly rate (annual rate ÷ 400), n = number of quarters"],
		faqs: [{ q: "Is RD interest taxable?", a: "Yes, interest earned on an RD is fully taxable as per your income slab, and banks deduct TDS if interest exceeds the prescribed threshold." }],
	},
	"fd-calculator": {
		intro: "A Fixed Deposit (FD) locks in a lump sum at a fixed rate for a chosen tenure, with interest compounded at your selected frequency.",
		formula: ["A = P × (1 + r/m)^(m×n)", "P = principal, r = annual rate, m = compounding periods per year, n = years"],
		faqs: [{ q: "Which compounding frequency should I pick?", a: "Match it to what your bank actually offers — most Indian bank FDs compound quarterly." }],
	},
	"epf-calculator": {
		intro:
			"The Employees' Provident Fund (EPF) is a mandatory retirement savings scheme where both you and your employer contribute a percentage of your basic salary + DA every month.",
		formula: ["Each year: balance = (balance + annual contributions) × (1 + EPF rate)", "Salary is assumed to grow by your specified annual increment."],
		faqs: [
			{ q: "Why 3.67% for employer contribution and not 12%?", a: "Of the employer's 12% contribution, 8.33% (capped) typically goes to the Employees' Pension Scheme (EPS) and the remainder to EPF — adjust the field if your case differs." },
		],
	},
	"ssy-calculator": {
		intro:
			"Sukanya Samriddhi Yojana (SSY) is a government savings scheme for a girl child's future, offering a high, government-notified interest rate with EEE tax status.",
		formula: ["Deposits continue for 15 years from account opening; the balance keeps compounding annually until maturity at 21 years from opening."],
		faqs: [{ q: "Can I withdraw before maturity?", a: "Partial withdrawal (up to 50%) is allowed once the girl turns 18, for education or marriage expenses." }],
	},
	"roi-calculator": {
		intro: "Calculate the absolute and annualised return on any investment — property, stocks, business, or otherwise.",
		formula: ["Absolute ROI % = (Final value − Initial) ÷ Initial × 100", "Annualised ROI (CAGR) % = [(Final ÷ Initial)^(1/years) − 1] × 100"],
		faqs: [],
	},
	"emi-calculator": {
		intro: "Calculate the Equated Monthly Instalment (EMI) for any loan using the standard reducing-balance formula.",
		formula: ["EMI = P × r × (1+r)^n ÷ [(1+r)^n − 1]", "P = loan amount, r = monthly interest rate, n = number of months"],
		faqs: [{ q: "Why does interest form a bigger share of early EMIs?", a: "Interest is charged on the outstanding balance, which is highest at the start — so early instalments are interest-heavy and later ones are principal-heavy." }],
	},
	"home-loan-emi-calculator": {
		intro: "Calculate your monthly home loan instalment, total interest outgo, and a year-by-year amortisation schedule.",
		formula: ["EMI = P × r × (1+r)^n ÷ [(1+r)^n − 1]", "P = loan amount, r = monthly interest rate, n = number of months"],
		faqs: [{ q: "Does this include processing fees or insurance?", a: "No — it calculates pure EMI on the principal. Add processing fees, insurance, and other charges separately to get your true cost of borrowing." }],
	},
	"car-loan-emi-calculator": {
		intro: "Calculate your monthly car loan instalment and total interest payable over the loan tenure.",
		formula: ["EMI = P × r × (1+r)^n ÷ [(1+r)^n − 1]", "P = loan amount, r = monthly interest rate, n = number of months"],
		faqs: [],
	},
	"income-tax-calculator": {
		intro:
			"Compare your income tax liability under the new and old tax regimes for FY 2025-26 (AY 2026-27), and see which one saves you more.",
		formula: [
			"New regime: ₹75,000 standard deduction, slab rates from 0% to 30%, full rebate up to ₹12L taxable income, with marginal relief tapering off just above ₹12L.",
			"Old regime: ₹50,000 standard deduction + your other deductions, slab rates from 0% to 30%, full rebate up to ₹5L taxable income, with marginal relief just above ₹5L.",
			"4% health & education cess is added to tax in both regimes.",
		],
		faqs: [
			{ q: "Which regime should I choose?", a: "If you claim large deductions (80C, HRA, home loan interest), the old regime often works out cheaper. With few deductions, the new regime usually wins — this calculator compares both for your numbers." },
			{ q: "Are these slabs final?", a: "They reflect FY 2025-26 rules per Budget 2025. Tax laws change — always verify on incometax.gov.in before filing." },
		],
	},
	"hra-calculator": {
		intro: "Calculate how much of your House Rent Allowance (HRA) is exempt from tax under Section 10(13A).",
		formula: ["Exemption = minimum of: HRA received, rent paid − 10% of basic+DA, or 50% (metro) / 40% (non-metro) of basic+DA"],
		faqs: [{ q: "Can I claim HRA exemption under the new tax regime?", a: "No — HRA exemption is only available under the old tax regime." }],
	},
	"salary-calculator": {
		intro: "Break down your annual CTC into basic, HRA, employer contributions, and your actual monthly take-home pay.",
		formula: ["Gross salary = CTC − employer PF − gratuity", "In-hand = Gross salary − employee PF − professional tax − income tax"],
		faqs: [{ q: "Why is my in-hand salary lower than CTC ÷ 12?", a: "CTC includes employer contributions (PF, gratuity) that you never receive as cash, plus deductions like employee PF and tax are subtracted before you're paid." }],
	},
	"gst-calculator": {
		intro: "Add GST to a base amount, or work out the base amount and GST from a GST-inclusive total.",
		formula: ["Adding GST: GST = amount × rate; Total = amount + GST", "Removing GST: Base = amount ÷ (1 + rate); GST = amount − base"],
		faqs: [],
	},
	"tds-calculator": {
		intro: "Estimate TDS (Tax Deducted at Source) for common payment types like rent, professional fees, contractor payments, and commission.",
		formula: ["TDS = payment amount × applicable section rate (or 20% flat if PAN is not available)"],
		faqs: [{ q: "Are these rates always accurate?", a: "They reflect commonly-cited standard rates but don't account for payment thresholds, surcharge, or recent circulars — verify the exact section and rate for your case with a CA." }],
	},
	"brokerage-calculator": {
		intro: "Estimate brokerage, STT, exchange charges, SEBI charges, stamp duty, and GST on an equity trade, and see your net P&L.",
		formula: ["Total charges = brokerage + STT + exchange charges + SEBI charges + stamp duty + GST (18% on brokerage + exchange + SEBI charges)"],
		faqs: [{ q: "Do these exact rates apply to my broker?", a: "Charges mirror a common discount-broker fee schedule. STT, exchange, and SEBI charges are statutory and apply broadly; brokerage and stamp duty can vary — check your broker's published tariff." }],
	},
	"margin-calculator": {
		intro: "Calculate how much margin money you need to put up for a leveraged trade, based on your broker's margin percentage.",
		formula: ["Order value = price × quantity", "Required margin = order value × margin %"],
		faqs: [],
	},
	"stock-average-calculator": {
		intro: "Add multiple buy transactions at different prices to find your average buy price and total investment.",
		formula: ["Average price = Σ(price × quantity) ÷ Σ(quantity)"],
		faqs: [],
	},
};
