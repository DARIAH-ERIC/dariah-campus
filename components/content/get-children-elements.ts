import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

export function getChildrenElements<TProps>(children: ReactNode): Array<ReactElement<TProps>> {
	// eslint-disable-next-line @eslint-react/no-children-to-array
	return Children.toArray(children).filter(isValidElement<TProps>);
}
