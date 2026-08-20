import { groupByToMap } from "@acdh-oeaw/lib";
import type { FC, ReactElement, ReactNode } from "react";

import { getChildrenElements } from "#/components/content/get-children-elements.ts";

/**
 * Groups children by component, so a content component whose allowed children are of several kinds can pick
 * out the ones it is interested in.
 *
 * Note that this only works in server components. The mdx content is rendered on the server, where the
 * components map and the imports here resolve to the same objects. A client component receives its children
 * as separate lazy references instead, and nothing matches.
 */
export function getChildrenByType(children: ReactNode) {
	const map = groupByToMap(getChildrenElements(children), (child) =>
		child.type
	);

	return function get<P extends object>(component: FC<P>): Array<ReactElement<P>> {
		return (map.get(component) ?? []) as Array<ReactElement<P>>;
	};
}
