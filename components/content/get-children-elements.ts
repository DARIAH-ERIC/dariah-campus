import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

export function getChildrenElements<TProps>(children: ReactNode): Array<ReactElement<TProps>> {
	return Children.toArray(children).filter(isValidElement<TProps>);
}
