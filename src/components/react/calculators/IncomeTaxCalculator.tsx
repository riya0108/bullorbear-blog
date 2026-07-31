import { useMemo, useState } from "react";
import { calculateIncomeTax } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, ResultTable } from "./ui";

export default function IncomeTaxCalculator() {
	const [income, setIncome] = useState(1200000);
	const [deductions, setDeductions] = useState(150000);

	const newRegime = useMemo(() => calculateIncomeTax(income, "new", 0), [income]);
	const oldRegime = useMemo(() => calculateIncomeTax(income, "old", deductions), [income, deductions]);

	const better = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";

	return (
		<div className="flex flex-col gap-8">
			<CalculatorLayout
				inputs={
					<>
						<NumberField label="Gross annual income" value={income} onChange={setIncome} prefix="₹" min={0} max={100000000} step={10000} />
						<NumberField
							label="Deductions (80C, 80D, home loan interest, etc.)"
							value={deductions}
							onChange={setDeductions}
							prefix="₹"
							min={0}
							max={1000000}
							step={5000}
							help="Only usable under the old regime"
						/>
					</>
				}
				results={
					<>
						<ResultStat label="Tax under new regime" value={formatINR(newRegime.totalTax)} emphasis={better === "new"} />
						<ResultStat label="Tax under old regime" value={formatINR(oldRegime.totalTax)} emphasis={better === "old"} />
						<Note>
							<span className="text-white/70">
								{better === "new" ? "The new regime works out cheaper" : "The old regime works out cheaper"} for these
								numbers by {formatINR(Math.abs(newRegime.totalTax - oldRegime.totalTax))}.
							</span>
						</Note>
					</>
				}
			/>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<h3 className="mb-3 text-lg font-bold text-ink">New regime (FY 2025-26)</h3>
					<ResultTable
						columns={["Item", "Amount"]}
						rows={[
							["Taxable income", formatINR(newRegime.taxableIncome)],
							["Tax before cess", formatINR(newRegime.taxBeforeCess)],
							["Rebate u/s 87A", formatINR(newRegime.rebateApplied)],
							["Health & education cess", formatINR(newRegime.cess)],
							["Total tax payable", formatINR(newRegime.totalTax)],
							["Take-home", formatINR(newRegime.takeHome)],
						]}
					/>
				</div>
				<div>
					<h3 className="mb-3 text-lg font-bold text-ink">Old regime</h3>
					<ResultTable
						columns={["Item", "Amount"]}
						rows={[
							["Taxable income", formatINR(oldRegime.taxableIncome)],
							["Tax before cess", formatINR(oldRegime.taxBeforeCess)],
							["Rebate u/s 87A", formatINR(oldRegime.rebateApplied)],
							["Health & education cess", formatINR(oldRegime.cess)],
							["Total tax payable", formatINR(oldRegime.totalTax)],
							["Take-home", formatINR(oldRegime.takeHome)],
						]}
					/>
				</div>
			</div>

			<Note>
				Tax slabs shown are for FY 2025-26 (AY 2026-27) as per Budget 2025 and include Section 87A rebate with marginal
				relief, but are for illustration only — they do not account for surcharge or every possible deduction. Verify
				current rates on incometax.gov.in or with a tax professional before filing.
			</Note>
		</div>
	);
}
