"use client";

import cn from "clsx/lite";
import { GripVerticalIcon } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";

interface ImageComparisonSliderProps {
	children?: ReactNode;
	left: string;
	/** @default "horizontal" */
	orientation?: "horizontal" | "vertical";
	right: string;
}

export function ImageComparisonSlider(props: Readonly<ImageComparisonSliderProps>): ReactNode {
	const { children, left, orientation = "horizontal", right } = props;

	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState(0);

	const init = useCallback(
		(element: HTMLElement | null) => {
			if (element == null) {
				return;
			}
			const dimensions = element.getBoundingClientRect();
			const position = orientation === "vertical" ? dimensions.height * 0.5 : dimensions.width * 0.5;
			setPosition(position);
		},
		[orientation],
	);

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
					const dimensions = event.currentTarget.getBoundingClientRect();
					const position =
						orientation === "vertical"
							? Math.min(Math.max(event.clientY - dimensions.top, 0), dimensions.height)
							: Math.min(Math.max(event.clientX - dimensions.left, 0), dimensions.width);
					setPosition(position);
					event.currentTarget.setPointerCapture(event.pointerId);
				}}
				onPointerMove={(event) => {
					if (!isDragging) {
						return;
					}
					const dimensions = event.currentTarget.getBoundingClientRect();
					const position =
						orientation === "vertical"
							? Math.min(Math.max(event.clientY - dimensions.top, 0), dimensions.height)
							: Math.min(Math.max(event.clientX - dimensions.left, 0), dimensions.width);
					setPosition(position);
				}}
				onPointerUp={(event) => {
					setIsDragging(false);
					event.currentTarget.releasePointerCapture(event.pointerId);
				}}
				style={{ "--position": `${String(position)}px` }}
			>
				{/* oxlint-disable-next-line @next/next/no-img-element */}
				<img
					alt=""
					className={cn(
						"object-cover select-none [grid-area:1/-1] block-full inline-full max-block-[min(60vh,32rem)]",
						orientation === "vertical" ? "rounded-t" : "rounded-s",
					)}
					draggable={false}
					src={left}
					style={{
						clipPath:
							orientation === "vertical"
								? "inset(0 0 calc(100%-var(--position)) 0)"
								: "inset(0 calc(100%-var(--position)) 0 0)",
					}}
				/>
				{/* oxlint-disable-next-line @next/next/no-img-element */}
				<img
					alt=""
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
					aria-label="Use arrow keys to move separator"
					className={cn(
						"absolute grid place-items-center",
						orientation === "vertical"
							? "translate-y-[calc(var(--position)-50%)] cursor-row-resize inline-full"
							: "translate-x-[calc(var(--position)-50%)] cursor-col-resize block-full",
					)}
					onKeyDown={(event) => {
						if (orientation === "vertical") {
							switch (event.key) {
								case "ArrowUp": {
									const newPosition = Math.max(position - 10, 0);
									setPosition(newPosition);
									break;
								}

								case "ArrowDown": {
									const dimensions = event.currentTarget.parentElement!.getBoundingClientRect();
									const newPosition = Math.min(position + 10, dimensions.height);
									setPosition(newPosition);
									break;
								}
							}
						} else {
							switch (event.key) {
								case "ArrowLeft": {
									const newPosition = Math.max(position - 10, 0);
									setPosition(newPosition);
									break;
								}

								case "ArrowRight": {
									const dimensions = event.currentTarget.parentElement!.getBoundingClientRect();
									const newPosition = Math.min(position + 10, dimensions.width);
									setPosition(newPosition);
									break;
								}
							}
						}
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
