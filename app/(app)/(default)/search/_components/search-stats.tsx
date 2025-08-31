"use client";

import type { ReactNode } from "react";
import { useStats } from "react-instantsearch-core";

export function SearchStats(): ReactNode {
	const stats = useStats();

	return (
		<div className="mx-auto text-sm text-neutral-600">
			<span>
				{stats.nbHits === 0
					? "Nothing found."
					: stats.nbHits === 1
						? "One result found."
						: `${String(stats.nbHits)} results found.`}
			</span>
		</div>
	);
}
