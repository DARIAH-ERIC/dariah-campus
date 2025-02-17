import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { createSearchUrl } from "@/lib/create-search-url";

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
			{people.map((person) => {
				const { id, image, name } = person;

				return (
					<li key={person.id} className="list-none">
						<Link
							className="inline-flex items-center space-x-2 leading-none transition hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
							href={createSearchUrl({ people: [id] })}
						>
							<Image
								alt=""
								className="size-8 rounded-full object-cover"
								height={32}
								src={image}
								width={32}
							/>
							<span>{name}</span>
						</Link>
					</li>
				);
			})}
		</div>
	);
}
