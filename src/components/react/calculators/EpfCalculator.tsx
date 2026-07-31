import { useMemo, useState } from "react";
import { calculateEpf } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, SplitBar } from "./ui";

export default function EpfCalculator() {
	const [basicDa, setBasicDa] = useState(25000);
	const [age, setAge] = useState(28);
	const [retireAge, setRetireAge] = useState(58);
	const [employeePct, setEmployeePct] = useState(12);
	const [employerPct, setEmployerPct] = useState(3.67);
	const [rate, setRate] = useState(8.25);
	const [salaryGrowth, setSalaryGrowth] = useState(8);
	const [existing, setExisting] = useState(200000);

	const result = useMemo(
		() => calculateEpf(basicDa, age, retireAge, employeePct, employerPct, rate, salaryGrowth, existing),
		[basicDa, age, retireAge, employeePct, employerPct, rate, salaryGrowth, existing],
	);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Current basic + DA (monthly)" value={basicDa} onChange={setBasicDa} prefix="₹" min={1000} max={1000000} step={500} />
					<div className="grid grid-cols-2 gap-4">
						<NumberField label="Current age" value={age} onChange={setAge} suffix="yrs" min={18} max={57} step={1} />
						<NumberField label="Retirement age" value={retireAge} onChange={setRetireAge} suffix="yrs" min={age + 1} max={60} step={1} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<NumberField label="Employee contribution" value={employeePct} onChange={setEmployeePct} suffix="%" min={1} max={12} step={0.01} />
						<NumberField label="Employer to EPF" value={employerPct} onChange={setEmployerPct} suffix="%" min={1} max={12} step={0.01} help="Rest goes to EPS" />
					</div>
					<NumberField label="EPF interest rate" value={rate} onChange={setRate} suffix="%" min={1} max={12} step={0.05} />
					<NumberField label="Annual salary growth" value={salaryGrowth} onChange={setSalaryGrowth} suffix="%" min={0} max={30} step={1} />
					<NumberField label="Existing EPF balance" value={existing} onChange={setExisting} prefix="₹" min={0} max={10000000} step={1000} />
				</>
			}
			results={
				<>
					<ResultStat label="Corpus at retirement" value={formatINR(result.totalValue)} emphasis />
					<SplitBar
						segments={[
							{ label: "Total contributions", value: result.investedAmount, colorClass: "bg-white/40" },
							{ label: "Interest earned", value: result.estimatedReturns, colorClass: "bg-primary" },
						]}
					/>
					<Note>
						<span className="text-white/70">
							Approximation using annual compounding on year-end balance — real EPFO interest is credited yearly on a
							monthly running balance.
						</span>
					</Note>
				</>
			}
		/>
	);
}
