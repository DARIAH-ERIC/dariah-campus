import type { ReactNode } from "react";

interface LinksProps {
	label: ReactNode;
	links: Array<{ label: string; href: string }>;
}

export function Links(props: Readonly<LinksProps>): ReactNode {
	const { label, links } = props;

	if (links.length === 0) {
		return null;
	}

	return (
		<dl className="grid gap-y-0.5 text-sm text-neutral-500">
			<dt className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</dt>
			<dd>
				<ul className="inline text-xs font-medium tracking-wide uppercase">
					{links.map((link, index) => {
						const { label, href } = link;

						return (
							<li key={index} className="leading-none">
								<a download={true} href={href}>
									{label}
								</a>
							</li>
						);
					})}
				</ul>
			</dd>
		</dl>
	);
}
