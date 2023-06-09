import { useLabels } from "@react-aria/utils";
import { type AriaLabelingProps } from "@react-types/shared";
import { type Toc } from "@stefanprobst/rehype-extract-toc";
import cx from "clsx";
import Link from "next/link";

import { useI18n } from "@/i18n/useI18n";
import { useTableOfContentsHighlight } from "@/views/post/useTableOfContentsHighlight";

export interface TableOfContentsProps extends AriaLabelingProps {
	/**
	 * Table of contents.
	 */
	toc: Toc;
	/**
	 * Optional heading. Should be wrapped in an appropriate heading element.
	 */
	title?: JSX.Element;
	className?: string;
}

/**
 * Table of contents.
 */
export function TableOfContents(props: TableOfContentsProps): JSX.Element {
	const { t } = useI18n();
	// TODO: check for aria-labelledby or aria-label when no title provided
	// TODO: automatically apply aria-labelledby on title prop if provided
	const title = props.title ?? null;
	const labelProps = useLabels(props, t("tableOfContents"));

	const highlightedHeadingId = useTableOfContentsHighlight();

	return (
		<nav {...labelProps} className={props.className}>
			{title}
			<TableOfContentsLevel headings={props.toc} highlightedHeadingId={highlightedHeadingId} />
		</nav>
	);
}

export interface TableOfContentsLevelProps {
	/**
	 * Table of contents branch.
	 */
	headings: Toc | undefined;
	/**
	 * Id of top heading in viewport.
	 */
	highlightedHeadingId: string | undefined;
	depth?: number;
}

/**
 * Table of contents level.
 */
export function TableOfContentsLevel(props: TableOfContentsLevelProps): JSX.Element | null {
	if (!Array.isArray(props.headings) || props.headings.length === 0) {
		return null;
	}

	const depth = props.depth ?? 0;

	return (
		<ol className="space-y-1.5" style={{ marginLeft: depth * 8 }}>
			{props.headings.map((heading, index) => {
				const isHighlighted = heading.id === props.highlightedHeadingId;

				return (
					<li key={index} className="space-y-1.5">
						{heading.id !== undefined ? (
							<Link
								href={{ hash: heading.id }}
								className={cx(
									"flex transition hover:text-primary-600 relative focus:outline-none rounded focus-visible:ring focus-visible:ring-primary-600",
									isHighlighted ? "font-bold pointer-events-none" : undefined,
								)}
							>
								{isHighlighted
									? // <Icon
									  //   icon={ChevronIcon}
									  //   className="flex-shrink-0 absolute w-3.5 transform -rotate-90 right-full h-full mr-1"
									  // />
									  null
									: null}
								{heading.value}
							</Link>
						) : (
							<span>{heading.value}</span>
						)}
						<TableOfContentsLevel
							headings={heading.children}
							highlightedHeadingId={props.highlightedHeadingId}
							depth={depth + 1}
						/>
					</li>
				);
			})}
		</ol>
	);
}
