import { useMemo, useState } from "react";
import { calculateIncomeTax, calculateSalaryBreakup } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, ResultTable } from "./ui";

export default function SalaryCalculator() {
	const [ctc, setCtc] = useState(1200000);
	const [basicPct, setBasicPct] = useState(40);
	const [hraPct, setHraPct] = useState(50);
	const [employeePfPct, setEmployeePfPct] = useState(12);
	const [employerPfPct, setEmployerPfPct] = useState(12);
	const [professionalTax, setProfessionalTax] = useState(2400);

	const estimatedTax = useMemo(() => calculateIncomeTax(ctc, "new", 0).totalTax, [ctc]);

	const result = useMemo(
		() => calculateSalaryBreakup(ctc, basicPct, hraPct, employeePfPct, employerPfPct, professionalTax, estimatedTax),
		[ctc, basicPct, hraPct, employeePfPct, employerPfPct, professionalTax, estimatedTax],
	);

	return (
		<div className="flex flex-col gap-8">
			<CalculatorLayout
				inputs={
					<>
						<NumberField label="Annual CTC" value={ctc} onChange={setCtc} prefix="₹" min={100000} max={100000000} step={10000} />
						<div className="grid grid-cols-2 gap-4">
							<NumberField label="Basic (% of CTC)" value={basicPct} onChange={setBasicPct} suffix="%" min={20} max={60} step={1} />
							<NumberField label="HRA (% of basic)" value={hraPct} onChange={setHraPct} suffix="%" min={0} max={60} step={1} />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<NumberField label="Employee PF" value={employeePfPct} onChange={setEmployeePfPct} suffix="%" min={0} max={12} step={0.5} />
							<NumberField label="Employer PF" value={employerPfPct} onChange={setEmployerPfPct} suffix="%" min={0} max={12} step={0.5} />
						</div>
						<NumberField label="Professional tax (annual)" value={professionalTax} onChange={setProfessionalTax} prefix="₹" min={0} max={5000} step={100} />
					</>
				}
				results={
					<>
						<ResultStat label="Monthly in-hand" value={formatINR(result.inHandMonthly)} emphasis />
						<ResultStat label="Annual in-hand" value={formatINR(result.inHandAnnual)} />
						<Note>
							<span className="text-white/70">
								Estimated income tax ({formatINR(estimatedTax)}/yr, new regime) is already deducted from take-home.
							</span>
						</Note>
					</>
				}
			/>

			<div>
				<h3 className="mb-3 text-lg font-bold text-ink">Salary breakup</h3>
				<ResultTable
					columns={["Component", "Annual amount"]}
					rows={[
						["Basic", formatINR(result.basic)],
						["HRA", formatINR(result.hra)],
						["Special allowance", formatINR(result.specialAllowance)],
						["Employer PF contribution", formatINR(result.employerPf)],
						["Gratuity", formatINR(result.gratuity)],
						["Gross salary", formatINR(result.grossSalary)],
						["Employee PF deduction", `- ${formatINR(result.employeePf)}`],
						["Professional tax", `- ${formatINR(professionalTax)}`],
						["Estimated income tax", `- ${formatINR(estimatedTax)}`],
						["Annual in-hand", formatINR(result.inHandAnnual)],
					]}
				/>
			</div>

			<Note>
				This is an indicative CTC breakup — actual basic/HRA/allowance splits, gratuity policy, and PF caps vary by
				employer. Use it as a starting estimate, not a payslip.
			</Note>
		</div>
	);
}
