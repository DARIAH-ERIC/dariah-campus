import type { ReactNode } from "react";

import { ContentTypeIcon } from "@/components/content-type-icon";
import { Link } from "@/components/link";

interface CurriculaListProps {
	curricula: Array<{ id: string; title: string; href: string }>;
	label: ReactNode;
}

export function CurriculaList(props: Readonly<CurriculaListProps>): ReactNode {
	const { curricula, label } = props;

	if (curricula.length === 0) return null;

	const id = "curricula-list";

	return (
		<nav aria-labelledby={id} className="grid w-full content-start gap-y-2">
			<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase" id={id}>
				{label}
			</h2>
			<ul className="grid content-start gap-y-2">
				{curricula.map((curriculum) => {
					const { id, title, href } = curriculum;

					return (
						<li key={id}>
							<Link
								className="relative flex items-baseline gap-x-1.5 rounded-sm text-sm transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
								href={href}
							>
								<ContentTypeIcon className="size-4 shrink-0 translate-y-0.5" kind="curriculum" />
								<span>{title}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
