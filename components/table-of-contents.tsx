"use client";

import { isNonEmptyArray } from "@acdh-oeaw/lib";
import type { TableOfContents as TableOfContentsTree } from "@acdh-oeaw/mdx-lib";
import cn from "clsx/lite";
import { ChevronRightIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import { Link } from "#/components/link.tsx";
import type { ContentSectionLink } from "#/lib/content/utils/get-content-sections.ts";
import { useLabels } from "#/lib/hooks/use-labels.ts";
import { useTableOfContentsHighlight } from "#/lib/hooks/use-table-of-contents-highlight.ts";
import { createHref } from "#/lib/navigation/create-href.ts";

interface TableOfContentsProps {
	"aria-labelledby"?: string;
	"aria-label"?: string;
	className?: string;
	/** Identifier of the section which is currently displayed, when the content is split up into sections. */
	currentSectionId?: string;
	/** Maps heading identifiers to the section they occur in, when the content is split up into sections. */
	headingSections?: Record<string, ContentSectionLink>;
	onChange?: () => void;
	tableOfContents: TableOfContentsTree;
	title?: ReactNode;
	variant?: "default" | "panel";
}

export function TableOfContents(props: Readonly<TableOfContentsProps>): ReactNode {
	const { className, currentSectionId, headingSections, onChange, tableOfContents, title, variant } = props;

	const labelProps = useLabels(props);

	const highlightedHeadingId = useTableOfContentsHighlight();
	const containerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (highlightedHeadingId == null) {
			return;
		}

		const highlightedLink = containerRef.current?.querySelector('[aria-current="location"]');

		highlightedLink?.scrollIntoView({ block: "nearest" });
	}, [highlightedHeadingId]);

	return (
		<nav {...labelProps} ref={containerRef} className={className}>
			{title}
			<TableOfContentsLevel
				currentSectionId={currentSectionId}
				headings={tableOfContents}
				headingSections={headingSections}
				highlightedHeadingId={highlightedHeadingId}
				onChange={onChange}
				variant={variant}
			/>
		</nav>
	);
}

interface TableOfContentsLevelProps {
	currentSectionId?: string;
	depth?: number;
	headings: TableOfContentsTree | undefined;
	headingSections?: Record<string, ContentSectionLink>;
	highlightedHeadingId: string | undefined;
	onChange?: () => void;
	variant?: "default" | "panel";
}

function TableOfContentsLevel(props: Readonly<TableOfContentsLevelProps>): ReactNode {
	const { currentSectionId, depth = 0, headings, headingSections, onChange, variant } = props;

	if (!isNonEmptyArray(headings)) {
		return null;
	}

	const spacing = variant === "panel" ? "space-y-3" : "space-y-1.5";

	return (
		<ol className={spacing} style={{ marginLeft: depth * 8 }}>
			{headings.map((heading, index) => {
				const isHighlighted = heading.id === props.highlightedHeadingId;
				/** Headings in other sections are only reachable by also switching to that section. */
				const section = heading.id != null ? headingSections?.[heading.id] : undefined;
				const pathname = section != null && section.id !== currentSectionId ? section.href : undefined;

				return (
					<li key={index} className={spacing}>
						{heading.id !== undefined ? (
							<Link
								aria-current={isHighlighted ? "location" : undefined}
								className={cn(
									"relative flex scroll-my-8 rounded-sm transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700",
									isHighlighted ? "pointer-events-none font-bold" : undefined,
								)}
								href={createHref({ hash: heading.id, pathname })}
								onPress={onChange}
							>
								{isHighlighted ? (
									<ChevronRightIcon
										aria-hidden={true}
										className="absolute inset-e-full me-1 shrink-0 transform block-full inline-3.5"
									/>
								) : null}
								{heading.value}
							</Link>
						) : (
							<span>{heading.value}</span>
						)}
						<TableOfContentsLevel
							currentSectionId={currentSectionId}
							depth={depth + 1}
							headings={heading.children}
							headingSections={headingSections}
							highlightedHeadingId={props.highlightedHeadingId}
							onChange={onChange}
							variant={variant}
						/>
					</li>
				);
			})}
		</ol>
	);
}
