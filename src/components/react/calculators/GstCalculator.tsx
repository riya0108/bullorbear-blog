import { useMemo, useState } from "react";
import { calculateGst } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat, SelectField, ToggleField } from "./ui";

const RATE_OPTIONS = [
	{ value: "3", label: "3%" },
	{ value: "5", label: "5%" },
	{ value: "12", label: "12%" },
	{ value: "18", label: "18%" },
	{ value: "28", label: "28%" },
];

export default function GstCalculator() {
	const [amount, setAmount] = useState(10000);
	const [rate, setRate] = useState("18");
	const [mode, setMode] = useState<"add" | "remove">("add");

	const result = useMemo(() => calculateGst(amount, Number(rate), mode), [amount, rate, mode]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<ToggleField
						label="GST is"
						value={mode}
						onChange={(v) => setMode(v as "add" | "remove")}
						options={[
							{ value: "add", label: "Excluded (add GST)" },
							{ value: "remove", label: "Included (remove GST)" },
						]}
					/>
					<NumberField label="Amount" value={amount} onChange={setAmount} prefix="₹" min={0} max={100000000} step={100} />
					<SelectField label="GST rate" value={rate} onChange={setRate} options={RATE_OPTIONS} />
				</>
			}
			results={
				<>
					<ResultStat label="Total amount" value={formatINR(result.totalAmount)} emphasis />
					<ResultStat label="Base amount" value={formatINR(result.baseAmount)} />
					<ResultStat label="GST amount" value={formatINR(result.gstAmount)} />
				</>
			}
		/>
	);
}
