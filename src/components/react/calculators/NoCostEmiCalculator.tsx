import { useMemo, useState } from "react";
import { formatINR } from "../../../lib/calculators/format";
import { NumberField, Note } from "./ui";

const GST_RATE = 0.18;

function calculate(input: {
	price: number;
	tenure: number;
	rate: number;
	fee: number;
	upfrontDiscount: number;
	emiDiscount: number;
	cashbackPercent: number;
}) {
	const { price, tenure, rate, fee, upfrontDiscount, emiDiscount, cashbackPercent } = input;

	const interest = price * (rate / 100);
	const gstOnInterest = interest * GST_RATE;
	const gstOnFee = fee * GST_RATE;
	const feeTotal = fee + gstOnFee;
	const cashbackEarned = price * (cashbackPercent / 100);

	const upfrontTotal = Math.max(price - upfrontDiscount - cashbackEarned, 0);

	const standardTotal = Math.max(price + interest + gstOnInterest + feeTotal - emiDiscount, 0);
	const ncemiTotal = Math.max(price + gstOnInterest + feeTotal - emiDiscount, 0);

	const standardMonthly = (price + interest) / tenure;
	const ncemiMonthly = price / tenure;

	return {
		interest,
		gstOnInterest,
		feeTotal,
		cashbackEarned,
		upfrontTotal,
		standardTotal,
		standardEffective: standardTotal + cashbackEarned,
		ncemiTotal,
		ncemiEffective: ncemiTotal + cashbackEarned,
		standardMonthly,
		ncemiMonthly,
	};
}

export default function NoCostEmiCalculator() {
	const [price, setPrice] = useState(60000);
	const [tenure, setTenure] = useState(6);
	const [rate, setRate] = useState(16);
	const [fee, setFee] = useState(199);
	const [upfrontDiscount, setUpfrontDiscount] = useState(0);
	const [emiDiscount, setEmiDiscount] = useState(0);
	const [cashbackPercent, setCashbackPercent] = useState(0);

	const result = useMemo(
		() => calculate({ price, tenure, rate, fee, upfrontDiscount, emiDiscount, cashbackPercent }),
		[price, tenure, rate, fee, upfrontDiscount, emiDiscount, cashbackPercent],
	);

	const options = [
		{ key: "upfront", label: "Pay Upfront", value: result.upfrontTotal },
		{ key: "standard", label: "Standard EMI", value: result.standardEffective },
		{ key: "ncemi", label: "No-Cost EMI", value: result.ncemiEffective },
	];
	const sorted = [...options].sort((a, b) => a.value - b.value);
	const cheapest = sorted[0];
	const mid = sorted[1];
	const most = sorted[2];
	const diffMid = mid.value - cheapest.value;
	const diffMost = most.value - cheapest.value;

	return (
		<div className="not-prose flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_3fr]">
				<div className="rounded-[2rem] bg-surface-card p-6 sm:p-8">
					<h3 className="mb-5 text-xs font-extrabold uppercase tracking-wide text-ash">Your purchase</h3>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<NumberField label="Product price" value={price} onChange={setPrice} prefix="₹" min={0} max={500000} step={500} />
						<NumberField label="EMI tenure" value={tenure} onChange={setTenure} suffix="months" min={1} max={36} step={1} />
						<NumberField
							label="Bank's EMI rate"
							value={rate}
							onChange={setRate}
							suffix="% p.a."
							min={0}
							max={30}
							step={0.5}
							help="13–16% typical"
						/>
						<NumberField
							label="Processing fee"
							value={fee}
							onChange={setFee}
							prefix="₹"
							min={0}
							max={5000}
							step={10}
							help="+18% GST"
						/>
						<NumberField
							label="Upfront discount"
							value={upfrontDiscount}
							onChange={setUpfrontDiscount}
							prefix="₹"
							min={0}
							max={price}
							step={100}
							help="0 if price is the same either way"
						/>
						<NumberField
							label="EMI-only discount"
							value={emiDiscount}
							onChange={setEmiDiscount}
							prefix="₹"
							min={0}
							max={price}
							step={100}
							help="Some sellers price EMI-only deals"
						/>
						<div className="sm:col-span-2">
							<NumberField
								label="Reward / cashback rate on normal spends"
								value={cashbackPercent}
								onChange={setCashbackPercent}
								suffix="%"
								min={0}
								max={10}
								step={0.5}
								help="Most cards exclude EMI transactions — check your T&Cs"
							/>
						</div>
					</div>
				</div>

				<div className="rounded-[2rem] bg-[#1c1712] p-6 text-white sm:p-8">
					<h3 className="mb-5 text-xs font-extrabold uppercase tracking-wide text-white/50">Cost comparison</h3>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{options.map((option) => {
							const isCheapest = option.key === cheapest.key;
							return (
								<div
									key={option.key}
									className={`flex flex-col rounded-2xl border p-4 ${
										isCheapest ? "border-bull/60 bg-bull/10" : "border-white/10 bg-white/5"
									}`}
								>
									{isCheapest ? (
										<span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-bull px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
											<span aria-hidden="true">✓</span> Cheapest
										</span>
									) : null}
									<p className="text-xs font-semibold uppercase tracking-wide text-white/60">{option.label}</p>
									<p className="mt-1 text-2xl font-extrabold text-white">{formatINR(option.value)}</p>
									{option.key === "upfront" ? (
										<div className="mt-2 space-y-0.5 text-xs text-white/60">
											<p>Discount applied: {formatINR(upfrontDiscount)}</p>
											<p>Cashback earned: {formatINR(result.cashbackEarned)}</p>
										</div>
									) : (
										<div className="mt-2 space-y-0.5 text-xs text-white/60">
											<p>
												Monthly: {formatINR(option.key === "standard" ? result.standardMonthly : result.ncemiMonthly)}/mo
											</p>
											<p>
												{option.key === "standard" ? "Interest" : "Interest waived"}: {formatINR(result.interest)}
											</p>
											<p>GST + fee: {formatINR(result.gstOnInterest + result.feeTotal)}</p>
										</div>
									)}
								</div>
							);
						})}
					</div>

					<div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-white/90">
						{diffMid < 1 ? (
							<>
								<span className="font-bold text-white">{cheapest.label}</span> and{" "}
								<span className="font-bold text-white">{mid.label}</span> come out roughly tied here — pick based on your cash
								flow, not the price.
							</>
						) : (
							<>
								<span className="font-bold text-white">{cheapest.label}</span> works out cheapest here —{" "}
								{formatINR(diffMid)} less than {mid.label}, and {formatINR(diffMost)} less than {most.label}.
							</>
						)}
					</div>
				</div>
			</div>

			<Note>
				Formula: interest = price × your entered rate; 18% GST applies to that interest and to the processing fee, matching
				current rules for credit-card EMI conversions. No-Cost EMI offsets the interest itself but not the GST on it. Forgone
				rewards are added back as a real cost on both EMI options. Verify exact rates and fees with your card issuer before
				buying.
			</Note>
		</div>
	);
}
