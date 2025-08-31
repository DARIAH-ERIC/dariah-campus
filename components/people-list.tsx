import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { createSearchUrl } from "@/lib/navigation/create-search-url";

const max = 4;

interface PeopleListProps {
	label: ReactNode;
	people: Array<{
		id: string;
		image: StaticImageData | string;
		name: string;
	}>;
}

export function PeopleList(props: Readonly<PeopleListProps>): ReactNode {
	const { label, people } = props;

	if (people.length === 0) return null;

	return (
		<div className="grid gap-y-1 text-sm text-neutral-500">
			<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</div>
			<ul>
				{people.slice(0, max).map((person) => {
					const { id, image, name } = person;

					return (
						<li key={person.id}>
							<Link
								className="inline-flex items-center gap-x-2 leading-none transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
			</ul>
			{people.length > max ? (
				<details>
					<summary className="cursor-pointer transition hover:text-brand-900">
						{`and ${String(people.length - max)} more`}
					</summary>
					<ul className="pt-2">
						{people.slice(max).map((person) => {
							const { id, image, name } = person;

							return (
								<li key={person.id}>
									<Link
										className="inline-flex items-center gap-x-2 leading-none transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
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
					</ul>
				</details>
			) : null}
		</div>
	);
}
