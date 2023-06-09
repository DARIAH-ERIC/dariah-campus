import { type ReactNode } from "react";

export interface GridProps {
	children?: ReactNode;
}

/**
 * Arrange components in a two-column grid.
 */
export function Grid(props: GridProps): JSX.Element {
	const { children } = props;

	return <div className="grid grid-cols-2 gap-4">{children}</div>;
}
