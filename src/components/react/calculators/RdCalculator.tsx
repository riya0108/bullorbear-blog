import { useMemo, useState } from "react";
import { calculateRd } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, SplitBar } from "./ui";

export default function RdCalculator() {
	const [monthly, setMonthly] = useState(5000);
	const [rate, setRate] = useState(7);
	const [months, setMonths] = useState(24);

	const result = useMemo(() => calculateRd(monthly, rate, months), [monthly, rate, months]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Monthly deposit" value={monthly} onChange={setMonthly} prefix="₹" min={100} max={500000} step={100} />
					<NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" min={1} max={12} step={0.1} help="Compounded quarterly" />
					<NumberField label="Tenure" value={months} onChange={setMonths} suffix="months" min={3} max={120} step={1} />
				</>
			}
			results={
				<>
					<ResultStat label="Maturity value" value={formatINR(result.totalValue)} emphasis />
					<SplitBar
						segments={[
							{ label: "Total deposits", value: result.investedAmount, colorClass: "bg-white/40" },
							{ label: "Interest earned", value: result.estimatedReturns, colorClass: "bg-primary" },
						]}
					/>
				</>
			}
		/>
	);
}
