import { useMemo, useState } from "react";
import { calculateMfReturns } from "../../../lib/calculators/finance";
import { formatPercent } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, SplitBar } from "./ui";

export default function MfReturnsCalculator() {
	const [invested, setInvested] = useState(100000);
	const [current, setCurrent] = useState(150000);
	const [years, setYears] = useState(3);

	const result = useMemo(() => calculateMfReturns(invested, current, years), [invested, current, years]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Invested amount" value={invested} onChange={setInvested} prefix="₹" min={1000} max={10000000} step={1000} />
					<NumberField label="Current value" value={current} onChange={setCurrent} prefix="₹" min={0} max={10000000} step={1000} />
					<NumberField label="Holding period" value={years} onChange={setYears} suffix="years" min={0.5} max={30} step={0.5} />
				</>
			}
			results={
				<>
					<ResultStat label="Absolute return" value={formatPercent(result.absoluteReturnPercent, 2)} emphasis />
					{result.cagrPercent !== null ? <ResultStat label="Annualised return (CAGR)" value={formatPercent(result.cagrPercent, 2)} /> : null}
					<SplitBar
						segments={[
							{ label: "Invested", value: invested, colorClass: "bg-white/40" },
							{ label: "Gain", value: Math.max(result.gain, 0), colorClass: "bg-primary" },
						]}
					/>
				</>
			}
		/>
	);
}
