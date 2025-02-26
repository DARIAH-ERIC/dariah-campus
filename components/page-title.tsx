import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode;
}

export function PageTitle(props: PageTitleProps): ReactNode {
	const { children } = props;

	return (
		<h1 className="text-balance text-center text-4xl font-extrabold leading-10">{children}</h1>
	);
}
