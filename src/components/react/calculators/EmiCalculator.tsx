import { useMemo, useState } from "react";
import { calculateEmi } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, ResultTable, SplitBar } from "./ui";

export interface EmiCalculatorProps {
	defaultLoanAmount?: number;
	defaultRate?: number;
	defaultYears?: number;
	loanLabel?: string;
}

export default function EmiCalculator({
	defaultLoanAmount = 2500000,
	defaultRate = 9,
	defaultYears = 20,
	loanLabel = "Loan amount",
}: EmiCalculatorProps) {
	const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
	const [rate, setRate] = useState(defaultRate);
	const [years, setYears] = useState(defaultYears);

	const result = useMemo(() => calculateEmi(loanAmount, rate, years), [loanAmount, rate, years]);

	return (
		<div className="flex flex-col gap-8">
			<CalculatorLayout
				inputs={
					<>
						<NumberField label={loanLabel} value={loanAmount} onChange={setLoanAmount} prefix="₹" min={10000} max={100000000} step={10000} />
						<NumberField label="Interest rate" value={rate} onChange={setRate} suffix="%" min={1} max={24} step={0.05} />
						<NumberField label="Loan tenure" value={years} onChange={setYears} suffix="years" min={1} max={30} step={1} />
					</>
				}
				results={
					<>
						<ResultStat label="Monthly EMI" value={formatINR(result.emi)} emphasis />
						<SplitBar
							segments={[
								{ label: "Principal", value: loanAmount, colorClass: "bg-white/40" },
								{ label: "Total interest", value: result.totalInterest, colorClass: "bg-primary" },
							]}
						/>
						<ResultStat label="Total payment" value={formatINR(result.totalPayment)} />
					</>
				}
			/>

			<div>
				<h3 className="mb-3 text-lg font-bold text-ink">Year-wise amortisation</h3>
				<ResultTable
					columns={["Year", "Principal paid", "Interest paid", "Balance"]}
					rows={result.schedule.map((row) => [
						row.year,
						formatINR(row.principalPaid),
						formatINR(row.interestPaid),
						formatINR(row.balance),
					])}
				/>
			</div>
		</div>
	);
}
