import { useMemo, useState } from "react";
import { calculateHraExemption } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, ToggleField } from "./ui";

export default function HraCalculator() {
	const [basicDa, setBasicDa] = useState(30000);
	const [hra, setHra] = useState(15000);
	const [rent, setRent] = useState(18000);
	const [city, setCity] = useState("metro");

	const result = useMemo(() => calculateHraExemption(basicDa, hra, rent, city === "metro"), [basicDa, hra, rent, city]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Basic + DA (monthly)" value={basicDa} onChange={setBasicDa} prefix="₹" min={1000} max={1000000} step={500} />
					<NumberField label="HRA received (monthly)" value={hra} onChange={setHra} prefix="₹" min={0} max={500000} step={500} />
					<NumberField label="Rent paid (monthly)" value={rent} onChange={setRent} prefix="₹" min={0} max={500000} step={500} />
					<ToggleField
						label="City type"
						value={city}
						onChange={setCity}
						options={[
							{ value: "metro", label: "Metro (50%)" },
							{ value: "non-metro", label: "Non-metro (40%)" },
						]}
					/>
				</>
			}
			results={
				<>
					<ResultStat label="Annual HRA exemption" value={formatINR(result.exemptAmount)} emphasis />
					<ResultStat label="Taxable HRA (annual)" value={formatINR(result.taxableHra)} />
					<Note>
						<span className="text-white/70">
							Exemption is the least of: HRA received, rent paid minus 10% of basic+DA, or 50%/40% of basic+DA for
							metro/non-metro cities. Only available under the old tax regime.
						</span>
					</Note>
				</>
			}
		/>
	);
}
