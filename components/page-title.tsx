import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode;
}

export function PageTitle(props: Readonly<PageTitleProps>): ReactNode {
	const { children } = props;

	return (
		<h1 className="text-center text-4xl leading-10 font-extrabold text-balance">{children}</h1>
	);
}
