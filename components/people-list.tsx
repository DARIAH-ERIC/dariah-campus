import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { ServerImage as Image } from "@/components/server-image";
import { createSearchUrl } from "@/lib/create-search-url";

const max = 4;

interface PeopleListProps {
	label: ReactNode;
	people: Array<{ id: string; image: string; name: string }>;
}

export function PeopleList(props: PeopleListProps): ReactNode {
	const { label, people } = props;

	if (people.length === 0) return null;

	return (
		<div className="grid gap-y-1 text-sm text-neutral-500">
			<ul className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</ul>
			{people.slice(0, max).map((person) => {
				const { id, image, name } = person;

				return (
					<li key={person.id} className="list-none">
						<Link
							className="inline-flex items-center space-x-2 leading-none transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
			{people.length > 4 ? <li className="list-none">and {people.length - 4} more</li> : null}
		</div>
	);
}
