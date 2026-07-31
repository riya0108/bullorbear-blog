import { useMemo, useState } from "react";
import { calculateMargin } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, ResultStat } from "./ui";

export default function MarginCalculator() {
	const [price, setPrice] = useState(1500);
	const [quantity, setQuantity] = useState(100);
	const [marginPercent, setMarginPercent] = useState(20);

	const result = useMemo(() => calculateMargin(price, quantity, marginPercent), [price, quantity, marginPercent]);

	return (
		<CalculatorLayout
			inputs={
				<>
					<NumberField label="Stock price" value={price} onChange={setPrice} prefix="₹" min={0.05} max={1000000} step={0.05} />
					<NumberField label="Quantity" value={quantity} onChange={setQuantity} min={1} max={1000000} step={1} />
					<NumberField
						label="Margin required by broker"
						value={marginPercent}
						onChange={setMarginPercent}
						suffix="%"
						min={1}
						max={100}
						step={1}
						help="e.g. 20% = 5x leverage"
					/>
				</>
			}
			results={
				<>
					<ResultStat label="Margin required" value={formatINR(result.requiredMargin)} emphasis />
					<ResultStat label="Total order value" value={formatINR(result.orderValue)} />
					<ResultStat label="Effective leverage" value={`${result.leverageMultiple.toFixed(2)}x`} />
				</>
			}
		/>
	);
}
