import type { ReactNode } from "react";

interface LinksListProps {
	label: string;
	links: ReadonlyArray<{ label: string; href: string }>;
}

export function LinksList(props: LinksListProps): ReactNode {
	const { label, links } = props;

	if (links.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</div>
			<div className="inline">
				<ul className="inline text-xs uppercase tracking-wide">
					{links.map((link, index) => {
						const { label, href } = link;

						return (
							<li key={index} className="inline list-none">
								<a href={href}>{label}</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
