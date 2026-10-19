import { Children, type ReactElement, type ReactNode, isValidElement } from "react";

export function getChildrenElements<TProps>(children: ReactNode): Array<ReactElement<TProps>> {
	// oxlint-disable-next-line react/no-react-children
	return Children.toArray(children).filter(isValidElement<TProps>);
}
