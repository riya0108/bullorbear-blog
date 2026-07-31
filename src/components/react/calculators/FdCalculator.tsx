import { useMemo, useState } from "react";
import { calculateFd } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, SelectField, SplitBar } from "./ui";

const COMPOUNDING_OPTIONS = [
	{ value: "yearly", label: "Yearly" },
	{ value: "half-yearly", label: "Half-yearly" },
	{ value: "quarterly", label: "Quarterly" },
	{ value: "monthly", label: "Monthly" },
];

export default function FdCalculator() {
	const [principal, setPrincipal] = useState(100000);
	const [rate, setRate] = useState(7);
	const [years, setYears] = useState(5);
	const [compounding, setCompounding] = useState("quarterly");

	const result = useMemo(
		() => calculateFd(principal, rate, years, compounding as "yearly" | "half-yearly" | "quarterly" | "monthly"),
		[principal, rate, years, compounding],
	);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Deposit amount" value={principal} onChange={setPrincipal} prefix="₹" min={1000} max={10000000} step={1000} />
					<NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" min={1} max={12} step={0.1} />
					<NumberField label="Tenure" value={years} onChange={setYears} suffix="years" min={0.25} max={10} step={0.25} />
					<SelectField label="Compounding frequency" value={compounding} onChange={setCompounding} options={COMPOUNDING_OPTIONS} />
				</>
			}
			results={
				<>
					<ResultStat label="Maturity value" value={formatINR(result.totalValue)} emphasis />
					<SplitBar
						segments={[
							{ label: "Principal", value: result.investedAmount, colorClass: "bg-white/40" },
							{ label: "Interest earned", value: result.estimatedReturns, colorClass: "bg-primary" },
						]}
					/>
				</>
			}
		/>
	);
}
