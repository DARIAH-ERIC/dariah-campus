import type { ReactNode } from "react";

interface PageLeadProps {
	children: ReactNode;
}

export function PageLead(props: Readonly<PageLeadProps>): ReactNode {
	const { children } = props;

	return <div className="text-center text-lg text-balance text-neutral-500">{children}</div>;
}
