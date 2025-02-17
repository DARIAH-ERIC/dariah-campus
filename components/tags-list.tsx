import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createSearchUrl } from "@/lib/create-search-url";

interface TagsListProps {
	label: ReactNode;
	tags: Array<{ id: string; name: string }>;
}

export function TagsList(props: TagsListProps): ReactNode {
	const { label, tags } = props;

	if (tags.length === 0) return null;

	return (
		<div className="flex flex-col space-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</div>
			<div className="inline">
				<ul className="inline text-xs uppercase tracking-wide">
					{tags.map((tag, index) => {
						const { id, name } = tag;

						return (
							<li key={id} className="inline list-none">
								<Link
									className="transition hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
									href={createSearchUrl({ tags: [id] })}
								>
									{name}
								</Link>
								{index !== tags.length - 1 ? <span>, </span> : null}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
