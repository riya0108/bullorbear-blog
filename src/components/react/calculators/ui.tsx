import type { ReactNode } from "react";
import { formatINR } from "../../../lib/calculators/format";

export function CalculatorLayout({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
			<div className="rounded-[2rem] bg-surface-card p-6 sm:p-8 lg:col-span-3">
				<div className="flex flex-col gap-6">{inputs}</div>
			</div>
			<div className="rounded-[2rem] bg-[#1c1712] p-6 text-white sm:p-8 lg:col-span-2">
				<div className="flex flex-col gap-6">{results}</div>
			</div>
		</div>
	);
}

export function NumberField({
	label,
	value,
	onChange,
	min = 0,
	max,
	step = 1,
	prefix,
	suffix,
	help,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	prefix?: string;
	suffix?: string;
	help?: string;
}) {
	return (
		<label className="block">
			<span className="mb-2 flex items-baseline justify-between text-sm font-bold text-ink">
				{label}
				{help ? <span className="text-xs font-normal text-mute">{help}</span> : null}
			</span>
			<div className="flex items-center gap-2 rounded-2xl border border-hairline bg-canvas px-4 py-3 focus-within:border-focus-outer">
				{prefix ? <span className="text-sm font-semibold text-mute">{prefix}</span> : null}
				<input
					type="number"
					className="w-full bg-transparent text-base font-bold text-ink outline-none"
					value={Number.isFinite(value) ? value : 0}
					min={min}
					max={max}
					step={step}
					onChange={(e) => {
						const next = e.target.valueAsNumber;
						onChange(Number.isFinite(next) ? next : 0);
					}}
				/>
				{suffix ? <span className="text-sm font-semibold text-mute">{suffix}</span> : null}
			</div>
			{max !== undefined ? (
				<input
					type="range"
					className="mt-3 w-full accent-[var(--color-primary)]"
					value={Math.min(Math.max(value, min), max)}
					min={min}
					max={max}
					step={step}
					onChange={(e) => onChange(Number(e.target.value))}
				/>
			) : null}
		</label>
	);
}

export function SelectField({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<label className="block">
			<span className="mb-2 block text-sm font-bold text-ink">{label}</span>
			<select
				className="w-full rounded-2xl border border-hairline bg-canvas px-4 py-3 text-base font-bold text-ink outline-none focus-within:border-focus-outer"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</label>
	);
}

export function ToggleField({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<div>
			<span className="mb-2 block text-sm font-bold text-ink">{label}</span>
			<div className="inline-flex rounded-full bg-canvas p-1">
				{options.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
							value === opt.value ? "bg-primary text-white" : "text-mute hover:text-ink"
						}`}
					>
						{opt.label}
					</button>
				))}
			</div>
		</div>
	);
}

export function ResultStat({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</p>
			<p className={emphasis ? "mt-1 text-3xl font-extrabold text-white sm:text-4xl" : "mt-1 text-xl font-bold text-white"}>
				{value}
			</p>
		</div>
	);
}

export function SplitBar({
	segments,
}: {
	segments: { label: string; value: number; colorClass: string }[];
}) {
	const total = segments.reduce((sum, s) => sum + Math.max(s.value, 0), 0);
	return (
		<div>
			<div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10">
				{segments.map((s) => (
					<div
						key={s.label}
						className={s.colorClass}
						style={{ width: `${total > 0 ? (Math.max(s.value, 0) / total) * 100 : 0}%` }}
					/>
				))}
			</div>
			<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
				{segments.map((s) => (
					<div key={s.label} className="flex items-center gap-2 text-sm">
						<span className={`h-2.5 w-2.5 rounded-full ${s.colorClass}`} />
						<span className="text-white/70">{s.label}</span>
						<span className="font-bold text-white">{formatINR(s.value)}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function ResultTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-hairline">
			<table className="w-full min-w-[420px] text-left text-sm">
				<thead>
					<tr className="bg-surface-card">
						{columns.map((col) => (
							<th key={col} className="px-4 py-3 font-bold text-ink">
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i} className="border-t border-hairline">
							{row.map((cell, j) => (
								<td key={j} className="px-4 py-2.5 text-body">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function Note({ children }: { children: ReactNode }) {
	return <p className="text-xs leading-relaxed text-mute">{children}</p>;
}
