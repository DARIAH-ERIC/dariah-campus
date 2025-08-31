"use client";

import { isNonEmptyArray } from "@acdh-oeaw/lib";
import type { TableOfContents as TableOfContentsTree } from "@acdh-oeaw/mdx-lib";
import cn from "clsx/lite";
import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { useLabels } from "@/lib/hooks/use-labels";
import { useTableOfContentsHighlight } from "@/lib/hooks/use-table-of-contents-highlight";
import { createHref } from "@/lib/navigation/create-href";

interface TableOfContentsProps {
	"aria-labelledby"?: string;
	"aria-label"?: string;
	className?: string;
	onChange?: () => void;
	tableOfContents: TableOfContentsTree;
	title?: ReactNode;
	variant?: "default" | "panel";
}

export function TableOfContents(props: Readonly<TableOfContentsProps>): ReactNode {
	const { className, onChange, tableOfContents, title, variant } = props;

	const labelProps = useLabels(props);

	const highlightedHeadingId = useTableOfContentsHighlight();

	return (
		<nav {...labelProps} className={className}>
			{title}
			<TableOfContentsLevel
				headings={tableOfContents}
				highlightedHeadingId={highlightedHeadingId}
				onChange={onChange}
				variant={variant}
			/>
		</nav>
	);
}

interface TableOfContentsLevelProps {
	depth?: number;
	headings: TableOfContentsTree | undefined;
	highlightedHeadingId: string | undefined;
	onChange?: () => void;
	variant?: "default" | "panel";
}

function TableOfContentsLevel(props: Readonly<TableOfContentsLevelProps>): ReactNode {
	const { depth = 0, headings, onChange, variant } = props;

	if (!isNonEmptyArray(headings)) {
		return null;
	}

	const spacing = variant === "panel" ? "space-y-3" : "space-y-1.5";

	return (
		<ol className={spacing} style={{ marginLeft: depth * 8 }}>
			{headings.map((heading, index) => {
				const isHighlighted = heading.id === props.highlightedHeadingId;

				return (
					<li key={index} className={spacing}>
						{heading.id !== undefined ? (
							<Link
								className={cn(
									"relative flex rounded transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700",
									isHighlighted ? "pointer-events-none font-bold" : undefined,
								)}
								href={createHref({ hash: heading.id })}
								onPress={onChange}
							>
								{isHighlighted ? (
									<ChevronRightIcon
										aria-hidden={true}
										className="absolute right-full mr-1 h-full w-3.5 shrink-0 transform"
									/>
								) : null}
								{heading.value}
							</Link>
						) : (
							<span>{heading.value}</span>
						)}
						<TableOfContentsLevel
							depth={depth + 1}
							headings={heading.children}
							highlightedHeadingId={props.highlightedHeadingId}
							variant={variant}
						/>
					</li>
				);
			})}
		</ol>
	);
}
