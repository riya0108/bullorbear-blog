import { useMemo, useState } from "react";
import { calculateStepUpSip } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, SplitBar } from "./ui";

export default function StepUpSipCalculator() {
	const [monthly, setMonthly] = useState(10000);
	const [stepUp, setStepUp] = useState(10);
	const [rate, setRate] = useState(12);
	const [years, setYears] = useState(10);

	const result = useMemo(() => calculateStepUpSip(monthly, stepUp, rate, years), [monthly, stepUp, rate, years]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Starting monthly investment" value={monthly} onChange={setMonthly} prefix="₹" min={500} max={500000} step={500} />
					<NumberField label="Annual step-up" value={stepUp} onChange={setStepUp} suffix="%" min={0} max={50} step={1} help="Increase applied each year" />
					<NumberField label="Expected annual return" value={rate} onChange={setRate} suffix="%" min={1} max={30} step={0.5} />
					<NumberField label="Investment period" value={years} onChange={setYears} suffix="years" min={1} max={40} step={1} />
				</>
			}
			results={
				<>
					<ResultStat label="Total value" value={formatINR(result.totalValue)} emphasis />
					<SplitBar
						segments={[
							{ label: "Invested amount", value: result.investedAmount, colorClass: "bg-white/40" },
							{ label: "Estimated returns", value: result.estimatedReturns, colorClass: "bg-primary" },
						]}
					/>
				</>
			}
		/>
	);
}
