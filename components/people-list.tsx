import type { ReactNode } from "react";

import { Image } from "@/components/image";

interface PeopleListProps {
	label: ReactNode;
	people: Array<{ id: string; image: string; name: string }>;
}

export function PeopleList(props: PeopleListProps): ReactNode {
	const { label, people } = props;

	if (people.length === 0) return null;

	return (
		<div className="flex flex-col space-y-2 text-sm text-neutral-500">
			<ul className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</ul>
			{people.map((person) => {
				const { image, name } = person;

				return (
					<li key={person.id} className="list-none">
						<div className="flex items-center space-x-1.5">
							<Image
								alt=""
								className="size-8 rounded-full object-cover"
								height={32}
								src={image}
								width={32}
							/>
							<span>{name}</span>
						</div>
					</li>
				);
			})}
		</div>
	);
}
