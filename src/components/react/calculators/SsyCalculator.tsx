import { useMemo, useState } from "react";
import { calculateSsy } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, SplitBar } from "./ui";

export default function SsyCalculator() {
	const [yearly, setYearly] = useState(100000);
	const [age, setAge] = useState(5);
	const [rate, setRate] = useState(8.2);

	const result = useMemo(() => calculateSsy(Math.min(yearly, 150000), age, rate), [yearly, age, rate]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Yearly investment" value={yearly} onChange={setYearly} prefix="₹" min={250} max={150000} step={250} help="Capped at ₹1.5L/year" />
					<NumberField label="Girl child's current age" value={age} onChange={setAge} suffix="yrs" min={0} max={10} step={1} />
					<NumberField label="SSY interest rate" value={rate} onChange={setRate} suffix="%" min={1} max={12} step={0.1} help="Government-notified, revised quarterly" />
				</>
			}
			results={
				<>
					<ResultStat label="Maturity value" value={formatINR(result.totalValue)} emphasis />
					<ResultStat label="Maturity age" value={`${result.maturityAge} years`} />
					<SplitBar
						segments={[
							{ label: "Invested amount", value: result.investedAmount, colorClass: "bg-white/40" },
							{ label: "Interest earned", value: result.estimatedReturns, colorClass: "bg-primary" },
						]}
					/>
					<Note>
						<span className="text-white/70">
							Deposits are made for 15 years from account opening; the balance keeps earning interest until maturity at 21
							years.
						</span>
					</Note>
				</>
			}
		/>
	);
}
