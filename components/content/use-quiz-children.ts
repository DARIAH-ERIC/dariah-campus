import { groupByToMap } from "@acdh-oeaw/lib";
import type { FC, ReactElement, ReactNode } from "react";

import { getChildrenElements } from "@/components/content/get-children-elements";

export function useQuizChildren(children: ReactNode) {
	const map = groupByToMap(getChildrenElements(children), (child) => {
		return child.type;
	});

	return function get<P extends object>(component: FC<P>) {
		return (map.get(component) ?? []) as Array<ReactElement<P>>;
	};
}
