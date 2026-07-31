/**
 * Pure financial calculation functions. No UI, no formatting — inputs and
 * outputs are plain numbers (₹, %, years) so every calculator component and
 * any future test can call the same verified math.
 */

// ---------------------------------------------------------------------
// Investment growth
// ---------------------------------------------------------------------

/**
 * Effective monthly rate derived from an annually-compounding rate: (1+r)^(1/12) - 1.
 * This is the convention used by Groww, IndMoney, and effectively every published
 * Indian SIP/SWP calculator — the "expected annual return" compounds annually, and
 * the monthly rate applied inside the loop is the equivalent effective monthly rate
 * (not a flat r/12 division, which overstates growth).
 */
function effectiveMonthlyRate(annualReturnPercent: number): number {
	return Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
}

export interface SipResult {
	investedAmount: number;
	estimatedReturns: number;
	totalValue: number;
}

/** SIP future value, deposit at the start of each month (industry-standard convention). */
export function calculateSip(monthlyInvestment: number, annualReturnPercent: number, years: number): SipResult {
	const months = Math.round(years * 12);
	const i = effectiveMonthlyRate(annualReturnPercent);
	const investedAmount = monthlyInvestment * months;

	let totalValue: number;
	if (i === 0) {
		totalValue = investedAmount;
	} else {
		totalValue = monthlyInvestment * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
	}

	return {
		investedAmount,
		estimatedReturns: totalValue - investedAmount,
		totalValue,
	};
}

/** Step-up SIP: monthly contribution rises by stepUpPercent at the start of every subsequent year. */
export function calculateStepUpSip(
	monthlyInvestment: number,
	annualStepUpPercent: number,
	annualReturnPercent: number,
	years: number,
): SipResult {
	const months = Math.round(years * 12);
	const i = effectiveMonthlyRate(annualReturnPercent);

	let balance = 0;
	let investedAmount = 0;
	for (let month = 1; month <= months; month++) {
		const yearIndex = Math.floor((month - 1) / 12);
		const deposit = monthlyInvestment * Math.pow(1 + annualStepUpPercent / 100, yearIndex);
		investedAmount += deposit;
		balance = (balance + deposit) * (1 + i);
	}

	return {
		investedAmount,
		estimatedReturns: balance - investedAmount,
		totalValue: balance,
	};
}

/** Lumpsum future value with annual compounding on the entered rate (CAGR-style). */
export function calculateLumpsum(principal: number, annualReturnPercent: number, years: number): SipResult {
	const totalValue = principal * Math.pow(1 + annualReturnPercent / 100, years);
	return {
		investedAmount: principal,
		estimatedReturns: totalValue - principal,
		totalValue,
	};
}

export interface SwpResult {
	totalWithdrawn: number;
	finalBalance: number;
	monthsUntilDepleted: number | null;
}

/** SWP: withdraw at the start of each month, then grow the remainder for that month. */
export function calculateSwp(
	totalInvestment: number,
	monthlyWithdrawal: number,
	annualReturnPercent: number,
	years: number,
): SwpResult {
	const months = Math.round(years * 12);
	const i = effectiveMonthlyRate(annualReturnPercent);

	let balance = totalInvestment;
	let totalWithdrawn = 0;
	let monthsUntilDepleted: number | null = null;

	for (let month = 1; month <= months; month++) {
		if (balance <= 0) {
			if (monthsUntilDepleted === null) monthsUntilDepleted = month - 1;
			balance = 0;
			continue;
		}
		const withdrawal = Math.min(monthlyWithdrawal, balance);
		balance -= withdrawal;
		totalWithdrawn += withdrawal;
		balance *= 1 + i;
	}

	return { totalWithdrawn, finalBalance: Math.max(balance, 0), monthsUntilDepleted };
}

export interface MfReturnsResult {
	absoluteReturnPercent: number;
	cagrPercent: number | null;
	gain: number;
}

export function calculateMfReturns(investedAmount: number, currentValue: number, years: number): MfReturnsResult {
	const gain = currentValue - investedAmount;
	const absoluteReturnPercent = investedAmount > 0 ? (gain / investedAmount) * 100 : 0;
	const cagrPercent = years > 0 && investedAmount > 0 ? (Math.pow(currentValue / investedAmount, 1 / years) - 1) * 100 : null;
	return { absoluteReturnPercent, cagrPercent, gain };
}

/** PPF: contribution made at the start of each financial year, annual compounding. */
export function calculatePpf(yearlyInvestment: number, annualRatePercent: number, years: number): SipResult {
	let balance = 0;
	const totalYears = Math.round(years);
	for (let y = 0; y < totalYears; y++) {
		balance = (balance + yearlyInvestment) * (1 + annualRatePercent / 100);
	}
	const investedAmount = yearlyInvestment * totalYears;
	return { investedAmount, estimatedReturns: balance - investedAmount, totalValue: balance };
}

/**
 * RD maturity value using the standard quarterly-compounding bank formula:
 * M = R * [(1+i)^n - 1] / (1 - (1+i)^(-1/3)), i = annual rate / 400 (quarterly), n = number of quarters.
 */
export function calculateRd(monthlyDeposit: number, annualRatePercent: number, months: number): SipResult {
	const i = annualRatePercent / 400;
	const n = months / 3;
	const investedAmount = monthlyDeposit * months;

	let totalValue: number;
	if (i === 0) {
		totalValue = investedAmount;
	} else {
		totalValue = monthlyDeposit * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
	}

	return { investedAmount, estimatedReturns: totalValue - investedAmount, totalValue };
}

const FD_COMPOUNDING_PER_YEAR: Record<string, number> = {
	yearly: 1,
	"half-yearly": 2,
	quarterly: 4,
	monthly: 12,
};

export function calculateFd(
	principal: number,
	annualRatePercent: number,
	years: number,
	compounding: keyof typeof FD_COMPOUNDING_PER_YEAR = "quarterly",
): SipResult {
	const m = FD_COMPOUNDING_PER_YEAR[compounding] ?? 4;
	const totalValue = principal * Math.pow(1 + annualRatePercent / 100 / m, m * years);
	return { investedAmount: principal, estimatedReturns: totalValue - principal, totalValue };
}

export interface EpfResult extends SipResult {
	employeeContribution: number;
	employerContribution: number;
}

/**
 * EPF projection, annual compounding on year-end balance (industry-standard approximation —
 * real EPFO interest is computed on monthly running balance but credited yearly).
 */
export function calculateEpf(
	currentBasicPlusDaMonthly: number,
	currentAge: number,
	retirementAge: number,
	employeeContributionPercent: number,
	employerContributionPercent: number,
	annualRatePercent: number,
	annualSalaryGrowthPercent: number,
	existingBalance: number,
): EpfResult {
	const years = Math.max(retirementAge - currentAge, 0);
	let balance = existingBalance;
	let salary = currentBasicPlusDaMonthly;
	let employeeContribution = 0;
	let employerContribution = 0;

	for (let y = 0; y < years; y++) {
		const monthlyEmployee = salary * (employeeContributionPercent / 100);
		const monthlyEmployer = salary * (employerContributionPercent / 100);
		const annualContribution = (monthlyEmployee + monthlyEmployer) * 12;
		employeeContribution += monthlyEmployee * 12;
		employerContribution += monthlyEmployer * 12;
		balance = (balance + annualContribution) * (1 + annualRatePercent / 100);
		salary *= 1 + annualSalaryGrowthPercent / 100;
	}

	const investedAmount = existingBalance + employeeContribution + employerContribution;
	return {
		investedAmount,
		estimatedReturns: balance - investedAmount,
		totalValue: balance,
		employeeContribution,
		employerContribution,
	};
}

/** SSY: deposits for 15 years from account opening, corpus keeps compounding until 21-year maturity. */
export function calculateSsy(yearlyInvestment: number, girlCurrentAge: number, annualRatePercent: number): SipResult & { maturityAge: number } {
	const depositYears = 15;
	const maturityYears = 21;
	let balance = 0;
	let investedAmount = 0;

	for (let y = 0; y < maturityYears; y++) {
		if (y < depositYears) {
			balance += yearlyInvestment;
			investedAmount += yearlyInvestment;
		}
		balance *= 1 + annualRatePercent / 100;
	}

	return {
		investedAmount,
		estimatedReturns: balance - investedAmount,
		totalValue: balance,
		maturityAge: girlCurrentAge + maturityYears,
	};
}

export interface RoiResult {
	absoluteReturnPercent: number;
	cagrPercent: number | null;
	gain: number;
}

export function calculateRoi(initialInvestment: number, finalValue: number, years?: number): RoiResult {
	const gain = finalValue - initialInvestment;
	const absoluteReturnPercent = initialInvestment > 0 ? (gain / initialInvestment) * 100 : 0;
	const cagrPercent =
		years && years > 0 && initialInvestment > 0 ? (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100 : null;
	return { absoluteReturnPercent, cagrPercent, gain };
}

// ---------------------------------------------------------------------
// Loans / EMI
// ---------------------------------------------------------------------

export interface EmiResult {
	emi: number;
	totalInterest: number;
	totalPayment: number;
	schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

export function calculateEmi(loanAmount: number, annualRatePercent: number, years: number): EmiResult {
	const months = Math.round(years * 12);
	const i = annualRatePercent / 100 / 12;

	let emi: number;
	if (i === 0) {
		emi = loanAmount / months;
	} else {
		emi = (loanAmount * i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1);
	}

	let balance = loanAmount;
	const schedule: EmiResult["schedule"] = [];
	let yearPrincipal = 0;
	let yearInterest = 0;

	for (let month = 1; month <= months; month++) {
		const interestPortion = balance * i;
		const principalPortion = Math.min(emi - interestPortion, balance);
		balance = Math.max(balance - principalPortion, 0);
		yearPrincipal += principalPortion;
		yearInterest += interestPortion;

		if (month % 12 === 0 || month === months) {
			schedule.push({
				year: Math.ceil(month / 12),
				principalPaid: yearPrincipal,
				interestPaid: yearInterest,
				balance,
			});
			yearPrincipal = 0;
			yearInterest = 0;
		}
	}

	const totalPayment = emi * months;
	return { emi, totalInterest: totalPayment - loanAmount, totalPayment, schedule };
}

// ---------------------------------------------------------------------
// Tax & salary (India)
// ---------------------------------------------------------------------

export interface TaxSlab {
	upTo: number | null; // null = no upper bound
	ratePercent: number;
}

/** New tax regime slabs, FY 2025-26 (AY 2026-27) per Budget 2025. */
export const NEW_REGIME_SLABS: TaxSlab[] = [
	{ upTo: 400000, ratePercent: 0 },
	{ upTo: 800000, ratePercent: 5 },
	{ upTo: 1200000, ratePercent: 10 },
	{ upTo: 1600000, ratePercent: 15 },
	{ upTo: 2000000, ratePercent: 20 },
	{ upTo: 2400000, ratePercent: 25 },
	{ upTo: null, ratePercent: 30 },
];

/** Old tax regime slabs, individuals below 60. Unchanged for several years. */
export const OLD_REGIME_SLABS: TaxSlab[] = [
	{ upTo: 250000, ratePercent: 0 },
	{ upTo: 500000, ratePercent: 5 },
	{ upTo: 1000000, ratePercent: 20 },
	{ upTo: null, ratePercent: 30 },
];

function slabTax(taxableIncome: number, slabs: TaxSlab[]): number {
	let tax = 0;
	let lastCap = 0;
	for (const slab of slabs) {
		const cap = slab.upTo ?? Infinity;
		if (taxableIncome > lastCap) {
			const taxableInSlab = Math.min(taxableIncome, cap) - lastCap;
			tax += taxableInSlab * (slab.ratePercent / 100);
		}
		lastCap = cap;
	}
	return tax;
}

export interface IncomeTaxResult {
	taxableIncome: number;
	taxBeforeCess: number;
	rebateApplied: number;
	cess: number;
	totalTax: number;
	takeHome: number;
}

/**
 * Section 87A rebate with marginal relief: once taxable income crosses the rebate
 * threshold, tax is capped at (taxableIncome − threshold) for as long as that's
 * smaller than the normal slab tax — so a rupee of extra income can never leave you
 * worse off than someone who earned exactly the threshold amount. Without this, the
 * rebate creates an artificial "cliff" right above the threshold that real tax law
 * (and every compliant calculator) smooths out.
 */
function applyRebateWithMarginalRelief(
	taxableIncome: number,
	slabTaxAmount: number,
	rebateThreshold: number,
	rebateCap: number,
): { tax: number; rebateApplied: number } {
	if (taxableIncome <= rebateThreshold) {
		const rebate = Math.min(slabTaxAmount, rebateCap);
		return { tax: slabTaxAmount - rebate, rebateApplied: rebate };
	}

	const excessOverThreshold = taxableIncome - rebateThreshold;
	if (slabTaxAmount > excessOverThreshold) {
		return { tax: excessOverThreshold, rebateApplied: slabTaxAmount - excessOverThreshold };
	}

	return { tax: slabTaxAmount, rebateApplied: 0 };
}

export function calculateIncomeTax(
	grossIncome: number,
	regime: "new" | "old",
	deductions: number,
): IncomeTaxResult {
	const standardDeduction = regime === "new" ? 75000 : 50000;
	const taxableIncome = Math.max(grossIncome - standardDeduction - deductions, 0);
	const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
	const rebateThreshold = regime === "new" ? 1200000 : 500000;
	const rebateCap = regime === "new" ? 60000 : 12500;

	const fullSlabTax = slabTax(taxableIncome, slabs);
	const { tax: taxBeforeCess, rebateApplied } = applyRebateWithMarginalRelief(
		taxableIncome,
		fullSlabTax,
		rebateThreshold,
		rebateCap,
	);

	const cess = taxBeforeCess * 0.04;
	const totalTax = taxBeforeCess + cess;

	return {
		taxableIncome,
		taxBeforeCess,
		rebateApplied,
		cess,
		totalTax,
		takeHome: grossIncome - totalTax,
	};
}

export interface HraResult {
	exemptAmount: number;
	taxableHra: number;
}

/** Annual HRA exemption = min(HRA received, rent paid - 10% of basic+DA, 50%/40% of basic+DA). */
export function calculateHraExemption(
	basicPlusDaMonthly: number,
	hraReceivedMonthly: number,
	rentPaidMonthly: number,
	isMetro: boolean,
): HraResult {
	const basic = basicPlusDaMonthly * 12;
	const hra = hraReceivedMonthly * 12;
	const rent = rentPaidMonthly * 12;

	const byRent = Math.max(rent - 0.1 * basic, 0);
	const byCityLimit = basic * (isMetro ? 0.5 : 0.4);

	const exemptAmount = Math.max(Math.min(hra, byRent, byCityLimit), 0);
	return { exemptAmount, taxableHra: Math.max(hra - exemptAmount, 0) };
}

export interface SalaryBreakupResult {
	basic: number;
	hra: number;
	employerPf: number;
	employeePf: number;
	gratuity: number;
	specialAllowance: number;
	grossSalary: number;
	totalDeductions: number;
	inHandMonthly: number;
	inHandAnnual: number;
}

/**
 * Indicative CTC → in-hand breakup. Real payslips vary by employer policy;
 * this uses commonly-used defaults (Basic 40% of CTC, HRA 50% of Basic, PF 12%).
 */
export function calculateSalaryBreakup(
	annualCtc: number,
	basicPercentOfCtc: number,
	hraPercentOfBasic: number,
	employeePfPercent: number,
	employerPfPercent: number,
	professionalTaxAnnual: number,
	incomeTaxAnnual: number,
): SalaryBreakupResult {
	const basic = annualCtc * (basicPercentOfCtc / 100);
	const hra = basic * (hraPercentOfBasic / 100);
	const gratuity = basic * 0.0481;
	const employerPf = basic * (employerPfPercent / 100);
	const employeePf = basic * (employeePfPercent / 100);
	const grossSalary = annualCtc - employerPf - gratuity;
	const specialAllowance = Math.max(grossSalary - basic - hra, 0);

	const totalDeductions = employeePf + professionalTaxAnnual + incomeTaxAnnual;
	const inHandAnnual = grossSalary - totalDeductions;

	return {
		basic,
		hra,
		employerPf,
		employeePf,
		gratuity,
		specialAllowance,
		grossSalary,
		totalDeductions,
		inHandMonthly: inHandAnnual / 12,
		inHandAnnual,
	};
}

export interface GstResult {
	baseAmount: number;
	gstAmount: number;
	totalAmount: number;
}

export function calculateGst(amount: number, ratePercent: number, mode: "add" | "remove"): GstResult {
	if (mode === "add") {
		const gstAmount = amount * (ratePercent / 100);
		return { baseAmount: amount, gstAmount, totalAmount: amount + gstAmount };
	}
	const baseAmount = amount / (1 + ratePercent / 100);
	return { baseAmount, gstAmount: amount - baseAmount, totalAmount: amount };
}

export interface TdsSection {
	code: string;
	label: string;
	ratePercent: number;
}

/** Common, frequently-referenced TDS sections. Rates are indicative — thresholds & surcharge not modelled. */
export const TDS_SECTIONS: TdsSection[] = [
	{ code: "194A", label: "Interest (other than securities)", ratePercent: 10 },
	{ code: "194C-ind", label: "Contractor payment — individual/HUF", ratePercent: 1 },
	{ code: "194C-other", label: "Contractor payment — others", ratePercent: 2 },
	{ code: "194H", label: "Commission or brokerage", ratePercent: 5 },
	{ code: "194I-land", label: "Rent — land/building/furniture", ratePercent: 10 },
	{ code: "194I-plant", label: "Rent — plant/machinery/equipment", ratePercent: 2 },
	{ code: "194J", label: "Professional or technical fees", ratePercent: 10 },
	{ code: "194", label: "Dividend", ratePercent: 10 },
];

export interface TdsResult {
	tdsRatePercent: number;
	tdsAmount: number;
	netPayment: number;
}

export function calculateTds(paymentAmount: number, sectionRatePercent: number, panAvailable: boolean): TdsResult {
	const tdsRatePercent = panAvailable ? sectionRatePercent : Math.max(sectionRatePercent, 20);
	const tdsAmount = paymentAmount * (tdsRatePercent / 100);
	return { tdsRatePercent, tdsAmount, netPayment: paymentAmount - tdsAmount };
}

// ---------------------------------------------------------------------
// Trading
// ---------------------------------------------------------------------

export interface BrokerageResult {
	turnover: number;
	brokerage: number;
	stt: number;
	exchangeCharges: number;
	sebiCharges: number;
	stampDuty: number;
	gst: number;
	totalCharges: number;
	netPnl: number;
	breakEvenPoints: number;
}

/**
 * Discount-broker style charge model (mirrors widely-published Zerodha-type schedules).
 * Rates are indicative and vary by broker — shown for illustration.
 */
export function calculateBrokerage(
	buyPrice: number,
	sellPrice: number,
	quantity: number,
	segment: "delivery" | "intraday",
	brokeragePerOrderFlat: number,
	brokeragePercentOfTurnover: number,
): BrokerageResult {
	const buyTurnover = buyPrice * quantity;
	const sellTurnover = sellPrice * quantity;
	const turnover = buyTurnover + sellTurnover;

	const brokeragePerOrder = Math.min(brokeragePerOrderFlat, buyTurnover * (brokeragePercentOfTurnover / 100));
	const brokerageSell = Math.min(brokeragePerOrderFlat, sellTurnover * (brokeragePercentOfTurnover / 100));
	const brokerage = brokeragePerOrder + brokerageSell;

	const stt = segment === "delivery" ? turnover * 0.001 : sellTurnover * 0.00025;
	const exchangeCharges = turnover * 0.0000297;
	const sebiCharges = turnover * 0.0000001;
	const stampDuty = segment === "delivery" ? buyTurnover * 0.00015 : buyTurnover * 0.00003;
	const gst = (brokerage + exchangeCharges + sebiCharges) * 0.18;

	const totalCharges = brokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst;
	const netPnl = sellTurnover - buyTurnover - totalCharges;
	const breakEvenPoints = quantity > 0 ? totalCharges / quantity : 0;

	return { turnover, brokerage, stt, exchangeCharges, sebiCharges, stampDuty, gst, totalCharges, netPnl, breakEvenPoints };
}

export interface MarginResult {
	orderValue: number;
	requiredMargin: number;
	leverageMultiple: number;
}

export function calculateMargin(price: number, quantity: number, marginPercent: number): MarginResult {
	const orderValue = price * quantity;
	const requiredMargin = orderValue * (marginPercent / 100);
	return { orderValue, requiredMargin, leverageMultiple: marginPercent > 0 ? 100 / marginPercent : 0 };
}

export interface StockLot {
	price: number;
	quantity: number;
}

export interface StockAverageResult {
	totalQuantity: number;
	totalInvestment: number;
	averagePrice: number;
}

export function calculateStockAverage(lots: StockLot[]): StockAverageResult {
	let totalQuantity = 0;
	let totalInvestment = 0;
	for (const lot of lots) {
		if (lot.price <= 0 || lot.quantity <= 0) continue;
		totalQuantity += lot.quantity;
		totalInvestment += lot.price * lot.quantity;
	}
	return {
		totalQuantity,
		totalInvestment,
		averagePrice: totalQuantity > 0 ? totalInvestment / totalQuantity : 0,
	};
}
