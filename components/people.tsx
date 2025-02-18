import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { ServerImage as Image } from "@/components/server-image";
import { createSearchUrl } from "@/lib/create-search-url";

const max = 4;

interface PeopleProps {
	people: Array<{ id: string; image: string; name: string }>;
	label: ReactNode;
}

export function People(props: PeopleProps): ReactNode {
	const { people, label } = props;

	if (people.length === 0) {
		return null;
	}

	return (
		<dl className="grid gap-y-1 text-sm text-neutral-500">
			<dt className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</dt>
			<dd>
				<ul className="space-y-0.5">
					{people.slice(0, max).map((author) => {
						const { id, image, name } = author;

						return (
							<li key={id}>
								<Link
									className="inline-flex items-center gap-x-2 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={createSearchUrl({ people: [id] })}
								>
									<Image
										alt=""
										className="size-8 rounded-full border border-neutral-200 object-cover"
										height={32}
										src={image}
										width={32}
									/>
									<span>{name}</span>
								</Link>
							</li>
						);
					})}
					{/* eslint-disable-next-line react/jsx-no-literals */}
					{people.length > 4 ? <li>and {people.length - 4} more</li> : null}
				</ul>
			</dd>
		</dl>
	);
}
