import type { ReactNode } from "react";

import { Image } from "@/components/image";

interface OrganisationsProps {
	label: string;
	organisations: ReadonlyArray<{ name: string; url: string; logo: string }>;
}

export function Organisations(props: Readonly<OrganisationsProps>): ReactNode {
	const { label, organisations } = props;

	if (organisations.length === 0) return null;

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</div>
			<div>
				<ul className="flex flex-wrap gap-x-3 text-xs font-medium">
					{organisations.map((tag, index) => {
						const { name, url, logo } = tag;

						return (
							<li key={index} className="list-none">
								<a
									className="transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={url}
								>
									<div className="overflow-hidden rounded-md">
										<Image
											alt=""
											/** Inverting the logo because they are all white. */
											className="h-10 w-auto object-contain p-2 opacity-50 invert"
											src={logo}
										/>
									</div>
									<span className="sr-only">{name}</span>
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
