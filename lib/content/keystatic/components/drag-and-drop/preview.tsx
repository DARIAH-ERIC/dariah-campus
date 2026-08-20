"use client";

import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import { type CSSProperties, type ReactNode, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface QuizDragAndDropPreviewProps {
	alt?: string;
	children: ReactNode;
	src: UseObjectUrlParams | null;
}

export function QuizDragAndDropPreview(props: Readonly<QuizDragAndDropPreviewProps>): ReactNode {
	const { alt = "", children, src } = props;

	const url = useObjectUrl(src);

	return (
		<figure className="grid gap-y-3 rounded-md border border-neutral-200 p-3">
			<NotEditable>
				<div
					className="group/overlay relative isolate overflow-hidden rounded-md min-block-12"
					data-drop-zone-overlay=""
					data-has-image={String(url != null)}
				>
					{url != null ? (
						// oxlint-disable-next-line @next/next/no-img-element
						<img alt={alt} className="block-auto inline-full" draggable={false} src={url} />
					) : (
						<div className="grid place-items-center bg-neutral-100 p-3 text-center text-neutral-500 min-block-32">
							Without a background image the drop zones are laid out in a grid, and their positions are ignored.
						</div>
					)}
				</div>
			</NotEditable>

			<figcaption>
				<div aria-label="Drop zones" className="grid gap-y-3" role="list">
					{children}
				</div>
			</figcaption>
		</figure>
	);
}

interface QuizDropZonePreviewProps {
	height: number | null;
	items: ReadonlyArray<string>;
	label: string;
	width: number | null;
	x: number | null;
	y: number | null;
}

/**
 * The zone is drawn onto the image preview, so the numbers in the form can be checked against the plan they describe.
 * Positioning happens through the form fields, so the box itself is not editable.
 */
export function QuizDropZonePreview(props: Readonly<QuizDropZonePreviewProps>): ReactNode {
	const { height, items, label, width, x, y } = props;

	const [overlay, setOverlay] = useState<HTMLElement | null>(null);

	const initCard = useCallback((element: HTMLDivElement | null) => {
		const overlay = element?.closest("figure")?.querySelector<HTMLElement>("[data-drop-zone-overlay]");

		setOverlay(overlay ?? null);
	}, []);

	const position = { height: height ?? 20, width: width ?? 25, x: x ?? 0, y: y ?? 0 };

	const style = {
		insetBlockStart: `${String(position.y)}%`,
		insetInlineStart: `${String(position.x)}%`,
		inlineSize: `${String(position.width)}%`,
		minBlockSize: `${String(position.height)}%`,
	} as CSSProperties;

	const box =
		overlay == null
			? null
			: createPortal(
					/** Without an image there is nothing to position against, so the boxes stay out of the way. */
					<div
						className="absolute flex flex-col gap-y-1 rounded-md border-2 border-dashed border-brand-700 bg-white/75 p-1 text-xs text-brand-900 group-data-[has-image=false]/overlay:hidden"
						style={style}
					>
						<span className="truncate font-medium">{label || "Untitled drop zone"}</span>
					</div>,
					overlay,
				);

	return (
		<div
			ref={initCard}
			className="rounded-md border border-(--kui-color-alias-border-idle) bg-(--kui-color-background-surface) p-3 text-(--kui-color-foreground-neutral-emphasis)"
			role="listitem"
		>
			<NotEditable>
				{box}
				<p className="text-sm font-medium">
					{label || "Untitled drop zone"} ({position.x}%, {position.y}%, {position.width}&nbsp;&times;{" "}
					{position.height}%)
				</p>
				<p className="text-sm text-(--kui-color-foreground-neutral-secondary)">
					{items.length > 0 ? items.join(", ") : "No items belong in this zone."}
				</p>
			</NotEditable>
		</div>
	);
}
