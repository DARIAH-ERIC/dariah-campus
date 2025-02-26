import type { ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout(props: Readonly<AppLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<div className="relative isolate grid min-h-full grid-rows-[auto_1fr_auto]">{children}</div>
	);
}
