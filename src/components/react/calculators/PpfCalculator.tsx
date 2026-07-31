import { useMemo, useState } from "react";
import { calculatePpf } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, SplitBar } from "./ui";

export default function PpfCalculator() {
	const [yearly, setYearly] = useState(150000);
	const [rate, setRate] = useState(7.1);
	const [years, setYears] = useState(15);

	const result = useMemo(() => calculatePpf(Math.min(yearly, 150000), rate, years), [yearly, rate, years]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Yearly investment" value={yearly} onChange={setYearly} prefix="₹" min={500} max={150000} step={500} help="Capped at ₹1.5L/year" />
					<NumberField label="PPF interest rate" value={rate} onChange={setRate} suffix="%" min={1} max={12} step={0.1} help="Government-notified, revised quarterly" />
					<NumberField label="Investment period" value={years} onChange={setYears} suffix="years" min={15} max={50} step={1} help="Minimum lock-in is 15 years" />
				</>
			}
			results={
				<>
					<ResultStat label="Maturity value" value={formatINR(result.totalValue)} emphasis />
					<SplitBar
						segments={[
							{ label: "Invested amount", value: result.investedAmount, colorClass: "bg-white/40" },
							{ label: "Interest earned", value: result.estimatedReturns, colorClass: "bg-primary" },
						]}
					/>
					<Note>
						<span className="text-white/70">Uses the current PPF rate — check the latest quarterly rate before investing.</span>
					</Note>
				</>
			}
		/>
	);
}
