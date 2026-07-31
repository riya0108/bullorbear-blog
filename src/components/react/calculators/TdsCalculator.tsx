import { useMemo, useState } from "react";
import { calculateTds, TDS_SECTIONS } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, SelectField, ToggleField } from "./ui";

const SECTION_OPTIONS = TDS_SECTIONS.map((s) => ({ value: s.code, label: `${s.label} — ${s.ratePercent}%` }));

export default function TdsCalculator() {
	const [amount, setAmount] = useState(50000);
	const [sectionCode, setSectionCode] = useState(TDS_SECTIONS[0].code);
	const [panAvailable, setPanAvailable] = useState("yes");

	const section = TDS_SECTIONS.find((s) => s.code === sectionCode) ?? TDS_SECTIONS[0];
	const result = useMemo(() => calculateTds(amount, section.ratePercent, panAvailable === "yes"), [amount, section, panAvailable]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Payment amount" value={amount} onChange={setAmount} prefix="₹" min={0} max={100000000} step={1000} />
					<SelectField label="Nature of payment" value={sectionCode} onChange={setSectionCode} options={SECTION_OPTIONS} />
					<ToggleField
						label="PAN available with deductee"
						value={panAvailable}
						onChange={setPanAvailable}
						options={[
							{ value: "yes", label: "Yes" },
							{ value: "no", label: "No (20% flat)" },
						]}
					/>
				</>
			}
			results={
				<>
					<ResultStat label="TDS amount" value={formatINR(result.tdsAmount)} emphasis />
					<ResultStat label="Net payment" value={formatINR(result.netPayment)} />
					<ResultStat label="TDS rate applied" value={`${result.tdsRatePercent}%`} />
					<Note>
						<span className="text-white/70">
							Rates shown are standard section rates and don't account for threshold limits or surcharge. Confirm the
							applicable section and rate with a tax professional.
						</span>
					</Note>
				</>
			}
		/>
	);
}
