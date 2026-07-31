export function formatINR(value: number, options?: { decimals?: number }): string {
	if (!Number.isFinite(value)) return "₹0";
	const decimals = options?.decimals ?? 0;
	return value.toLocaleString("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: decimals,
		minimumFractionDigits: decimals,
	});
}

export function formatNumber(value: number, decimals = 0): string {
	if (!Number.isFinite(value)) return "0";
	return value.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

export function formatPercent(value: number, decimals = 1): string {
	if (!Number.isFinite(value)) return "0%";
	return `${value.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}%`;
}

/** Compact Indian units — e.g. 12,34,567 -> "12.35 L", 1,23,45,678 -> "1.23 Cr". */
export function formatCompactINR(value: number): string {
	const abs = Math.abs(value);
	if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
	if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
	if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1)} K`;
	return formatINR(value);
}
