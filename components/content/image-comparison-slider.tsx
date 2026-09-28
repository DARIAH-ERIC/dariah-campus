"use client";

import cn from "clsx/lite";
import { GripVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useCallback, useState } from "react";

type Orientation = "horizontal" | "vertical";

/** The size of the axis the separator moves along. */
function getSize(element: Element, orientation: Orientation): number {
	const dimensions = element.getBoundingClientRect();

	return orientation === "vertical" ? dimensions.height : dimensions.width;
}

/** Where a pointer event falls on that axis, clamped to the element. */
function getOffset(element: Element, orientation: Orientation, event: { clientX: number; clientY: number }): number {
	const dimensions = element.getBoundingClientRect();
	const offset = orientation === "vertical" ? event.clientY - dimensions.top : event.clientX - dimensions.left;

	return Math.min(Math.max(offset, 0), orientation === "vertical" ? dimensions.height : dimensions.width);
}

/** How far the arrow keys move the separator. */
const step = 10;

interface ImageComparisonSliderProps {
	children?: ReactNode;
	left: string;
	leftAlt?: string;
	/** @default "horizontal" */
	orientation?: Orientation;
	right: string;
	rightAlt?: string;
}

export function ImageComparisonSlider(props: Readonly<ImageComparisonSliderProps>): ReactNode {
	const { children, left, leftAlt = "", orientation = "horizontal", right, rightAlt = "" } = props;

	const t = useTranslations("content.ImageComparisonSlider");

	const [isDragging, setIsDragging] = useState(false);
	/**
	 * The separator is positioned in pixels, but a focusable `separator` is a range widget, so it also has to report
	 * where it sits as a percentage. That needs the size it was measured against, so both are kept together.
	 */
	const [separator, setSeparator] = useState({ position: 0, size: 0 });
	const { position, size } = separator;

	const init = useCallback(
		(element: HTMLElement | null) => {
			if (element == null) {
				return;
			}

			const size = getSize(element, orientation);

			setSeparator({ position: size * 0.5, size });
		},
		[orientation],
	);

	const percentage = size === 0 ? 0 : (position / size) * 100;

	return (
		<figure className="flex flex-col">
			<div
				ref={init}
				className={cn(
					"group not-prose relative grid touch-none rounded-sm border border-neutral-200 min-block-12",
					isDragging ? (orientation === "vertical" ? "cursor-row-resize" : "cursor-col-resize") : "cursor-pointer",
				)}
				data-dragging={isDragging}
				data-orientation={orientation}
				onPointerDown={(event) => {
					if (event.button !== 0) {
						return;
					}
					setIsDragging(true);
					setSeparator({
						position: getOffset(event.currentTarget, orientation, event),
						size: getSize(event.currentTarget, orientation),
					});
					event.currentTarget.setPointerCapture(event.pointerId);
				}}
				onPointerMove={(event) => {
					if (!isDragging) {
						return;
					}
					setSeparator({
						position: getOffset(event.currentTarget, orientation, event),
						size: getSize(event.currentTarget, orientation),
					});
				}}
				onPointerUp={(event) => {
					setIsDragging(false);
					event.currentTarget.releasePointerCapture(event.pointerId);
				}}
				style={{ "--position": `${String(position)}px` }}
			>
				{/* oxlint-disable-next-line @next/next/no-img-element */}
				<img
					alt={leftAlt}
					className={cn(
						"object-cover select-none [grid-area:1/-1] block-full inline-full max-block-[min(60vh,32rem)]",
						orientation === "vertical" ? "rounded-t" : "rounded-s",
					)}
					draggable={false}
					src={left}
					style={{
						clipPath:
							orientation === "vertical"
								? "inset(0 0 calc(100% - var(--position)) 0)"
								: "inset(0 calc(100% - var(--position)) 0 0)",
					}}
				/>
				{/* oxlint-disable-next-line @next/next/no-img-element */}
				<img
					alt={rightAlt}
					className={cn(
						"object-cover select-none [grid-area:1/-1] block-full inline-full max-block-[min(60vh,32rem)]",
						orientation === "vertical" ? "rounded-b" : "rounded-e",
					)}
					draggable={false}
					src={right}
					style={{
						clipPath: orientation === "vertical" ? "inset(var(--position) 0 0 0)" : "inset(0 0 0 var(--position))",
					}}
				/>
				<div
					aria-label={t("separator-label")}
					/** The separator itself lies across the axis the images are split along. */
					aria-orientation={orientation === "vertical" ? "horizontal" : "vertical"}
					aria-valuenow={Math.round(percentage)}
					className={cn(
						"absolute grid place-items-center",
						orientation === "vertical"
							? "translate-y-[calc(var(--position)-50%)] cursor-row-resize inline-full"
							: "translate-x-[calc(var(--position)-50%)] cursor-col-resize block-full",
					)}
					onKeyDown={(event) => {
						const element = event.currentTarget.parentElement;

						if (element == null) {
							return;
						}

						const size = getSize(element, orientation);

						const direction =
							orientation === "vertical"
								? event.key === "ArrowUp"
									? -1
									: event.key === "ArrowDown"
										? 1
										: 0
								: event.key === "ArrowLeft"
									? -1
									: event.key === "ArrowRight"
										? 1
										: 0;

						if (direction === 0) {
							return;
						}

						setSeparator((state) => {
							return {
								position: Math.min(Math.max(state.position + direction * step, 0), size),
								size,
							};
						});
					}}
					role="separator"
					tabIndex={0}
				>
					<div
						className={cn(
							"rounded-sm bg-white shadow-sm [grid-area:1/-1]",
							orientation === "vertical" ? "block-1 inline-full" : "block-full inline-1",
						)}
					/>
					<GripVerticalIcon
						aria-hidden={true}
						className={cn(
							"rounded-sm bg-white shadow-sm [grid-area:1/-1] block-6 inline-3",
							orientation === "vertical" ? "rotate-90" : "",
						)}
					/>
				</div>
			</div>
			{children != null ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}
