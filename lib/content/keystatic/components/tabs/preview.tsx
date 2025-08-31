import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";

interface TabsPreviewProps {
	children: ReactNode;
}

export function TabsPreview(props: Readonly<TabsPreviewProps>): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}

interface TabPreviewProps {
	children: ReactNode;
	title: string;
}

export function TabPreview(props: Readonly<TabPreviewProps>): ReactNode {
	const { children, title } = props;

	return (
		<div className="grid gap-y-2 text-sm">
			<strong className="font-bold">{isNonEmptyString(title) ? title : "(No title)"}</strong>
			<div>{children}</div>
		</div>
	);
}
