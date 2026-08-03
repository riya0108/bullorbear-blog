import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export interface Stat {
	label: string;
	value: number;
	suffix?: string;
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { margin: "-40px" });
	const shouldReduceMotion = useReducedMotion();
	const [display, setDisplay] = useState(shouldReduceMotion ? value : 0);

	useEffect(() => {
		if (shouldReduceMotion) {
			setDisplay(value);
			return;
		}
		if (!isInView) {
			setDisplay(0);
			return;
		}
		const controls = animate(0, value, {
			duration: 1.4,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: (v) => setDisplay(Math.round(v)),
		});
		return () => controls.stop();
	}, [isInView, value, shouldReduceMotion]);

	return (
		<span ref={ref}>
			{display.toLocaleString("en-IN")}
			{suffix}
		</span>
	);
}

export default function StatCounters({ stats }: { stats: Stat[] }) {
	return (
		<div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
			{stats.map((stat) => (
				<div key={stat.label} className="text-center sm:text-left">
					<p className="text-3xl font-extrabold text-ink sm:text-4xl">
						<Counter value={stat.value} suffix={stat.suffix} />
					</p>
					<p className="mt-1 text-xs font-semibold uppercase tracking-wide text-mute sm:text-sm">
						{stat.label}
					</p>
				</div>
			))}
		</div>
	);
}
