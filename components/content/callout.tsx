import { capitalize, isNonEmptyString } from "@acdh-oeaw/lib";
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

import type { CalloutKind } from "@/lib/content";

const icons: Record<Exclude<CalloutKind, "none">, LucideIcon> = {
	caution: BoltIcon,
	important: InfoIcon,
	note: PencilIcon,
	tip: LightbulbIcon,
	warning: AlertTriangleIcon,
};

const calloutStyles = styles({
	base: "my-12 grid gap-y-3 rounded-md border p-6 shadow [&_*]:text-inherit [&_*::marker]:text-inherit",
	variants: {
		kind: {
			caution: "border-l-4 border-error-200 border-l-error-600 bg-error-50 text-error-800",
			important:
				"border-l-4 border-important-200 border-l-important-600 bg-important-50 text-important-800",
			note: "border-l-4 border-neutral-200 border-l-neutral-600 bg-neutral-100 text-neutral-800",
			tip: "border-l-4 border-success-200 border-l-success-600 bg-success-50 text-success-800",
			warning: "border-l-4 border-warning-200 border-l-warning-500 bg-warning-50 text-warning-800",
			none: "border-neutral-200 bg-neutral-100 text-neutral-800",
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

	return (
		<aside className={calloutStyles({ kind })}>
			<CalloutHeader kind={kind} title={title} />
			<div className="[&_:first-child]:mt-0 [&_:last-child]:mb-0 [&_a]:underline [&_a:hover]:no-underline">
				{children}
			</div>
		</aside>
	);
}

interface CalloutHeaderProps {
	kind: CalloutKind;
	title?: string;
}

function CalloutHeader(props: Readonly<CalloutHeaderProps>): ReactNode {
	const { kind, title } = props;

	const hasTitle = isNonEmptyString(title);

	if (kind !== "none") {
		const Icon = icons[kind];

		return (
			<strong className="flex items-center gap-x-2 font-bold">
				<Icon aria-hidden={true} className="size-5 shrink-0" />
				<span>{hasTitle ? title : capitalize(kind)}</span>
			</strong>
		);
	}

	if (hasTitle) {
		return <strong className="font-bold">{title}</strong>;
	}

	return null;
}
