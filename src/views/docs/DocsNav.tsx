import cx from "clsx";

import { type DocPreview } from "@/cms/api/docs.api";
import { NavLink } from "@/navigation/NavLink";
import { routes } from "@/navigation/routes.config";

export interface DocsNavProps {
	nav: Array<DocPreview>;
}

export function DocsNav(props: DocsNavProps): JSX.Element {
	return (
		<nav aria-label="Documentation" className="space-y-2">
			<h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">{`Documentation overview`}</h2>
			<ul className="space-y-1.5">
				{props.nav.map((page) => {
					return (
						<li key={page.id}>
							<NavLink
								href={routes.docs({ id: page.id })}
								className={(isCurrent) =>
									cx(
										"flex transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600",
										isCurrent && "font-bold pointer-events-none",
									)
								}
							>
								{page.title}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
