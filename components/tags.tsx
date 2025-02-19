import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createSearchUrl } from "@/lib/create-search-url";

interface TagsProps {
	label: ReactNode;
	tags: Array<{ id: string; name: string }>;
}

export function Tags(props: TagsProps): ReactNode {
	const { label, tags } = props;

	if (tags.length === 0) {
		return null;
	}

	return (
		<dl className="grid gap-y-0.5 text-sm text-neutral-500">
			<dt className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</dt>
			<dd>
				<ul className="inline text-xs font-medium uppercase tracking-wide">
					{tags.map((tag, index) => {
						const { id, name } = tag;

						return (
							<li key={id} className="inline leading-none">
								<Link
									className="transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={createSearchUrl({ tags: [id] })}
								>
									{name}
								</Link>
								{index !== tags.length - 1 ? <span>, </span> : null}
							</li>
						);
					})}
				</ul>
			</dd>
		</dl>
	);
}
