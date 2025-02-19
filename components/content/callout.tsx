import { capitalize } from "@acdh-oeaw/lib";
import { styles } from "@acdh-oeaw/style-variants";
import {
	AlertTriangleIcon,
	BoltIcon,
	InfoIcon,
	LightbulbIcon,
	type LucideIcon,
	PencilIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { CalloutKind } from "@/lib/content/options";

const icons: Record<CalloutKind, LucideIcon> = {
	caution: BoltIcon,
	important: InfoIcon,
	note: PencilIcon,
	tip: LightbulbIcon,
	warning: AlertTriangleIcon,
};

const calloutStyles = styles({
	base: "my-12 grid gap-y-3 rounded-md border border-l-4 p-6 shadow [&_*::marker]:text-inherit [&_*]:text-inherit",
	variants: {
		kind: {
			caution: "border-error-200 border-l-error-600 bg-error-50 text-error-800",
			important: "border-important-200 border-l-important-600 bg-important-50 text-important-800",
			note: "border-neutral-200 border-l-neutral-600 bg-neutral-100 text-neutral-800",
			tip: "border-success-200 border-l-success-600 bg-success-50 text-success-800",
			warning: "border-warning-200 border-l-warning-500 bg-warning-50 text-warning-800",
		},
	},
	defaults: {
		kind: "note",
	},
});

interface CalloutProps {
	children: ReactNode;
	/** @default "note" */
	kind?: CalloutKind;
	title?: string;
}

export function Callout(props: Readonly<CalloutProps>): ReactNode {
	const { children, kind = "note", title } = props;

	const Icon = icons[kind];

	return (
		<aside className={calloutStyles({ kind })}>
			<strong className="flex items-center gap-x-2 font-bold">
				<Icon className="size-5 shrink-0" />
				<span>{title ?? capitalize(kind)}</span>
			</strong>
			<div className="[&_a:hover]:no-underline [&_a]:underline">{children}</div>
		</aside>
	);
}
