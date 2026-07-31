import { useMemo, useState } from "react";
import { calculateStockAverage, type StockLot } from "../../../lib/calculators/finance";
import { formatINR, formatNumber } from "../../../lib/calculators/format";
import { CalculatorLayout, ResultStat } from "./ui";

export default function StockAverageCalculator() {
	const [lots, setLots] = useState<StockLot[]>([
		{ price: 100, quantity: 10 },
		{ price: 120, quantity: 15 },
	]);

	const result = useMemo(() => calculateStockAverage(lots), [lots]);

	function updateLot(index: number, field: keyof StockLot, value: number) {
		setLots((prev) => prev.map((lot, i) => (i === index ? { ...lot, [field]: value } : lot)));
	}

	function addLot() {
		setLots((prev) => [...prev, { price: 0, quantity: 0 }]);
	}

	function removeLot(index: number) {
		setLots((prev) => prev.filter((_, i) => i !== index));
	}

	return (
		<CalculatorLayout
			inputs={
				<>
					<span className="text-sm font-bold text-ink">Buy transactions</span>
					<div className="flex flex-col gap-3">
						{lots.map((lot, i) => (
							<div key={i} className="flex items-end gap-2">
								<label className="flex-1">
									<span className="mb-1.5 block text-xs font-semibold text-mute">Price</span>
									<div className="flex items-center gap-2 rounded-2xl border border-hairline bg-canvas px-3 py-2.5">
										<span className="text-sm text-mute">₹</span>
										<input
											type="number"
											className="w-full bg-transparent text-sm font-bold text-ink outline-none"
											value={lot.price}
											min={0}
											step={0.05}
											onChange={(e) => updateLot(i, "price", e.target.valueAsNumber || 0)}
										/>
									</div>
								</label>
								<label className="flex-1">
									<span className="mb-1.5 block text-xs font-semibold text-mute">Quantity</span>
									<div className="flex items-center gap-2 rounded-2xl border border-hairline bg-canvas px-3 py-2.5">
										<input
											type="number"
											className="w-full bg-transparent text-sm font-bold text-ink outline-none"
											value={lot.quantity}
											min={0}
											step={1}
											onChange={(e) => updateLot(i, "quantity", e.target.valueAsNumber || 0)}
										/>
									</div>
								</label>
								<button
									type="button"
									onClick={() => removeLot(i)}
									disabled={lots.length <= 1}
									className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canvas text-mute hover:bg-secondary-bg disabled:opacity-30"
									aria-label="Remove transaction"
								>
									&times;
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={addLot}
						className="self-start rounded-full bg-canvas px-4 py-2 text-sm font-bold text-ink hover:bg-secondary-bg"
					>
						+ Add transaction
					</button>
				</>
			}
			results={
				<>
					<ResultStat label="Average buy price" value={formatINR(result.averagePrice, { decimals: 2 })} emphasis />
					<ResultStat label="Total quantity" value={formatNumber(result.totalQuantity)} />
					<ResultStat label="Total investment" value={formatINR(result.totalInvestment)} />
				</>
			}
		/>
	);
}
