import { Children, type ReactElement, type ReactNode, isValidElement } from "react";

export function getChildrenElements<TProps>(children: ReactNode): Array<ReactElement<TProps>> {
	return Children.toArray(children).filter(isValidElement<TProps>);
}
