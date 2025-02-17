import type { ReactNode } from "react";

import { ServerImage as Image } from "@/components/server-image";

interface PeopleProps {
	people: Array<{ id: string; image: string; name: string }>;
	label: ReactNode;
}

export function People(props: PeopleProps): ReactNode {
	const { people, label } = props;

	if (people.length === 0) return null;

	return (
		<dl className="text-sm text-neutral-500">
			<dt className="sr-only">{label}</dt>
			<dd>
				<ul className="space-y-2">
					{people.map((author) => {
						const { id, image, name } = author;

						return (
							<li key={id}>
								<div className="flex items-center space-x-2">
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
				</ul>
			</dd>
		</dl>
	);
}
