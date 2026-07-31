import { useMemo, useState } from "react";
import { calculateRoi } from "../../../lib/calculators/finance";
import { formatPercent } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, SplitBar } from "./ui";

export default function RoiCalculator() {
	const [initial, setInitial] = useState(100000);
	const [final, setFinal] = useState(150000);
	const [years, setYears] = useState(3);

	const result = useMemo(() => calculateRoi(initial, final, years), [initial, final, years]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Initial investment" value={initial} onChange={setInitial} prefix="₹" min={100} max={10000000} step={100} />
					<NumberField label="Final value" value={final} onChange={setFinal} prefix="₹" min={0} max={10000000} step={100} />
					<NumberField label="Holding period" value={years} onChange={setYears} suffix="years" min={0} max={40} step={0.5} help="Optional, for annualised return" />
				</>
			}
			results={
				<>
					<ResultStat label="Absolute ROI" value={formatPercent(result.absoluteReturnPercent, 2)} emphasis />
					{result.cagrPercent !== null ? <ResultStat label="Annualised ROI (CAGR)" value={formatPercent(result.cagrPercent, 2)} /> : null}
					<SplitBar
						segments={[
							{ label: "Initial investment", value: initial, colorClass: "bg-white/40" },
							{ label: "Gain", value: Math.max(result.gain, 0), colorClass: "bg-primary" },
						]}
					/>
				</>
			}
		/>
	);
}
