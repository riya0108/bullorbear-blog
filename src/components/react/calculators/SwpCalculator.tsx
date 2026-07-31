import { useMemo, useState } from "react";
import { calculateSwp } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, SplitBar } from "./ui";

export default function SwpCalculator() {
	const [corpus, setCorpus] = useState(1000000);
	const [withdrawal, setWithdrawal] = useState(8000);
	const [rate, setRate] = useState(8);
	const [years, setYears] = useState(10);

	const result = useMemo(() => calculateSwp(corpus, withdrawal, rate, years), [corpus, withdrawal, rate, years]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Total investment" value={corpus} onChange={setCorpus} prefix="₹" min={10000} max={100000000} step={10000} />
					<NumberField label="Monthly withdrawal" value={withdrawal} onChange={setWithdrawal} prefix="₹" min={500} max={1000000} step={500} />
					<NumberField label="Expected annual return" value={rate} onChange={setRate} suffix="%" min={1} max={30} step={0.5} />
					<NumberField label="Withdrawal period" value={years} onChange={setYears} suffix="years" min={1} max={40} step={1} />
				</>
			}
			results={
				<>
					<ResultStat label="Final balance" value={formatINR(result.finalBalance)} emphasis />
					<SplitBar
						segments={[
							{ label: "Total withdrawn", value: result.totalWithdrawn, colorClass: "bg-white/40" },
							{ label: "Final balance", value: result.finalBalance, colorClass: "bg-primary" },
						]}
					/>
					{result.monthsUntilDepleted !== null ? (
						<Note>
							<span className="text-white/70">
								Your corpus runs out after {Math.floor(result.monthsUntilDepleted / 12)} years{" "}
								{result.monthsUntilDepleted % 12} months at this withdrawal rate.
							</span>
						</Note>
					) : null}
				</>
			}
		/>
	);
}
