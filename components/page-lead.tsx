import type { ReactNode } from "react";

interface PageLeadProps {
	children: ReactNode;
}

export function PageLead(props: PageLeadProps): ReactNode {
	const { children } = props;

	return <div className="text-balance text-center text-lg text-neutral-500">{children}</div>;
}
