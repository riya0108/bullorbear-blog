import { useMemo, useState } from "react";
import { calculateBrokerage } from "../../../lib/calculators/finance";
import { formatINR } from "../../../lib/calculators/format";
import { CalculatorLayout, NumberField, Note, ResultStat, ResultTable, ToggleField } from "./ui";

export default function BrokerageCalculator() {
	const [buyPrice, setBuyPrice] = useState(100);
	const [sellPrice, setSellPrice] = useState(105);
	const [quantity, setQuantity] = useState(100);
	const [segment, setSegment] = useState<"delivery" | "intraday">("delivery");
	const [flatBrokerage, setFlatBrokerage] = useState(0);

	function handleSegmentChange(next: "delivery" | "intraday") {
		setSegment(next);
		setFlatBrokerage(next === "delivery" ? 0 : 20);
	}

	const result = useMemo(
		() => calculateBrokerage(buyPrice, sellPrice, quantity, segment, flatBrokerage, 0.03),
		[buyPrice, sellPrice, quantity, segment, flatBrokerage],
	);

	return (
		<div className="flex flex-col gap-8">
			<CalculatorLayout
				inputs={
					<>
						<ToggleField
							label="Segment"
							value={segment}
							onChange={(v) => handleSegmentChange(v as "delivery" | "intraday")}
							options={[
								{ value: "delivery", label: "Equity delivery" },
								{ value: "intraday", label: "Equity intraday" },
							]}
						/>
						<div className="grid grid-cols-2 gap-4">
							<NumberField label="Buy price" value={buyPrice} onChange={setBuyPrice} prefix="₹" min={0.05} max={1000000} step={0.05} />
							<NumberField label="Sell price" value={sellPrice} onChange={setSellPrice} prefix="₹" min={0.05} max={1000000} step={0.05} />
						</div>
						<NumberField label="Quantity" value={quantity} onChange={setQuantity} min={1} max={1000000} step={1} />
						<NumberField
							label="Brokerage per order"
							value={flatBrokerage}
							onChange={setFlatBrokerage}
							prefix="₹"
							min={0}
							max={100}
							step={1}
							help="Most discount brokers charge ₹0 on delivery"
						/>
					</>
				}
				results={
					<>
						<ResultStat label="Net P&L" value={formatINR(result.netPnl)} emphasis />
						<ResultStat label="Total charges" value={formatINR(result.totalCharges)} />
						<ResultStat label="Break-even move" value={`₹${result.breakEvenPoints.toFixed(2)} / share`} />
					</>
				}
			/>

			<div>
				<h3 className="mb-3 text-lg font-bold text-ink">Charges breakdown</h3>
				<ResultTable
					columns={["Charge", "Amount"]}
					rows={[
						["Brokerage", formatINR(result.brokerage)],
						["STT", formatINR(result.stt)],
						["Exchange transaction charges", formatINR(result.exchangeCharges)],
						["SEBI charges", formatINR(result.sebiCharges)],
						["Stamp duty", formatINR(result.stampDuty)],
						["GST (18%)", formatINR(result.gst)],
						["Total charges", formatINR(result.totalCharges)],
					]}
				/>
			</div>

			<Note>
				Charge rates mirror a typical discount-broker schedule (STT, exchange, SEBI, stamp duty, GST) and are indicative
				— actual brokerage, DP charges, and taxes vary by broker and are revised periodically.
			</Note>
		</div>
	);
}
