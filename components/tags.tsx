import type { ReactNode } from "react";

interface TagsProps {
	label: ReactNode;
	tags: Array<{ id: string; name: string }>;
}

export function Tags(props: TagsProps): ReactNode {
	const { label, tags } = props;

	if (tags.length === 0) return null;

	return (
		<dl className="space-x-1.5 text-sm text-neutral-500">
			<dt className="inline font-medium text-neutral-600">{label}:</dt>
			<dd className="inline">
				<ul className="inline text-xs uppercase tracking-wide">
					{tags.map((tag, index) => {
						const { id, name } = tag;

						return (
							<li key={id} className="inline">
								<span>{name}</span>
								{index !== tags.length - 1 ? <span>, </span> : null}
							</li>
						);
					})}
				</ul>
			</dd>
		</dl>
	);
}
