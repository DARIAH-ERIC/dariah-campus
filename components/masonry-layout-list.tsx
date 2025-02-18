"use client";

import { Fragment, type ReactNode } from "react";

import { useMasonryLayout } from "@/lib/content/use-masonry-layout";

interface MasonryLayoutListProps {
	children: ReactNode;
	variant?: "default" | "search";
}

export function MasonryLayoutList(props: MasonryLayoutListProps): ReactNode {
	const { children, variant } = props;

	const columns = useMasonryLayout(children, variant);

	if (columns == null) {
		return (
			<ul
				className="grid grid-cols-[repeat(auto-fill,minmax(min(24rem,100%),1fr))] gap-6"
				role="list"
			>
				{children}
			</ul>
		);
	}

	return (
		<ul className="flex gap-x-6" role="list">
			{columns.map((column, index) => {
				return (
					<div key={index} className="grid flex-1 content-start gap-y-6">
						{column.map((child, index) => {
							return <Fragment key={index}>{child}</Fragment>;
						})}
					</div>
				);
			})}
		</ul>
	);
}
