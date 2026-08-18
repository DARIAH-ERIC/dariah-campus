"use client";


import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { Button } from "@keystar/ui/button";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import { MapPinIcon } from "lucide-react";
import {
	type CSSProperties,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

interface QuizImageHotspotsPreviewProps {
	alt?: string;
	children: ReactNode;
	src: UseObjectUrlParams | null;
}

export function QuizImageHotspotsPreview(props: Readonly<QuizImageHotspotsPreviewProps>): ReactNode {
	const { alt = "", children, src } = props;
	const url = useObjectUrl(src);

	return (
		<figure className="grid gap-y-3 rounded-md border border-neutral-200 p-3">
			<NotEditable>
				<div className="relative isolate overflow-hidden rounded-md min-block-12" data-hotspot-overlay="">
					{url != null ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img alt={alt} className="block-auto inline-full" draggable={false} src={url} />
					) : (
						<div className="grid place-items-center bg-neutral-100 text-neutral-500 min-block-32">
							Choose an image to place hotspots.
						</div>
					)}
				</div>
			</NotEditable>
			<figcaption>
				<div aria-label="Hotspots" className="grid gap-y-3" role="list">
					{children}
				</div>
			</figcaption>
		</figure>
	);
}

interface QuizImageHotspotValue {
	label: string;
	x: number | null;
	y: number | null;
}

interface QuizImageHotspotEditorProps {
	children?: ReactNode;
	isSelected: boolean;
	onChange: (value: QuizImageHotspotValue) => void;
	onEditChildren?: () => void;
	onSelect: () => void;
	value: QuizImageHotspotValue;
}

export function QuizImageHotspotEditor(props: Readonly<QuizImageHotspotEditorProps>): ReactNode {
	const { children, isSelected, onChange, onEditChildren, onSelect, value } = props;
	const dragStateRef = useRef<{
		hasMoved: boolean;
		pointerId: number;
		startX: number;
		startY: number;
	} | null>(null);
	const [overlay, setOverlay] = useState<HTMLElement | null>(null);
	const x = value.x ?? 50;
	const y = value.y ?? 50;
	const initCard = useCallback((element: HTMLDivElement | null) => {
		const overlay = element?.closest("figure")?.querySelector<HTMLElement>("[data-hotspot-overlay]");
		setOverlay(overlay ?? null);
	}, []);
	const style = {
		"--hotspot-x": `${String(x)}%`,
		"--hotspot-y": `${String(y)}%`,
	} as CSSProperties;

	function getPosition(clientX: number, clientY: number): { x: number; y: number } | null {
		if (overlay == null) {return null;}

		const bounds = overlay.getBoundingClientRect();
		const x = Math.min(Math.max(((clientX - bounds.left) / bounds.width) * 100, 0), 100);
		const y = Math.min(Math.max(((clientY - bounds.top) / bounds.height) * 100, 0), 100);

		return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
	}

	function previewPointerPosition(event: ReactPointerEvent<HTMLButtonElement>): void {
		const position = getPosition(event.clientX, event.clientY);
		if (position == null) {return;}

		event.currentTarget.style.setProperty("--hotspot-x", `${String(position.x)}%`);
		event.currentTarget.style.setProperty("--hotspot-y", `${String(position.y)}%`);
	}

	const marker =
		overlay == null
			? null
			: createPortal(
					<button
						aria-label={`Move hotspot: ${value.label || "Untitled hotspot"}`}
						className={cn(
							"absolute inset-s-(--hotspot-x) inset-bs-(--hotspot-y) grid -translate-1/2 touch-none place-items-center rounded-full border-2 border-white bg-brand-700 text-white shadow-md transition outline-none block-9 inline-9 hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2",
							isSelected ? "scale-125 bg-brand-900 ring-4 ring-brand-300" : undefined,
						)}
						onFocus={onSelect}
						onKeyDown={(event) => {
							const step = event.shiftKey ? 5 : 1;
							const movement = {
								ArrowDown: [0, step],
								ArrowLeft: [-step, 0],
								ArrowRight: [step, 0],
								ArrowUp: [0, -step],
							}[event.key];

							if (movement == null) {return;}
							event.preventDefault();
							onChange({
								...value,
								x: Math.min(Math.max(x + movement[0]!, 0), 100),
								y: Math.min(Math.max(y + movement[1]!, 0), 100),
							});
						}}
						onPointerDown={(event) => {
							if (event.button !== 0) {return;}
							onSelect();
							event.preventDefault();
							event.stopPropagation();
							event.currentTarget.setPointerCapture(event.pointerId);
							dragStateRef.current = {
								hasMoved: false,
								pointerId: event.pointerId,
								startX: event.clientX,
								startY: event.clientY,
							};
						}}
						onPointerMove={(event) => {
							if (!event.currentTarget.hasPointerCapture(event.pointerId)) {return;}
							const drag = dragStateRef.current;
							if (drag?.pointerId !== event.pointerId) {return;}

							if (!drag.hasMoved) {
								const deltaX = event.clientX - drag.startX;
								const deltaY = event.clientY - drag.startY;
								if (Math.hypot(deltaX, deltaY) < 4) {return;}
								drag.hasMoved = true;
							}
							previewPointerPosition(event);
						}}
						onPointerUp={(event) => {
							if (!event.currentTarget.hasPointerCapture(event.pointerId)) {return;}
							const hasMoved = dragStateRef.current?.hasMoved === true;
							event.currentTarget.releasePointerCapture(event.pointerId);
							dragStateRef.current = null;
							if (!hasMoved) {return;}

							const position = getPosition(event.clientX, event.clientY);
							if (position != null) {onChange({ ...value, ...position });}
						}}
						style={style}
						type="button"
					>
						<MapPinIcon aria-hidden={true} className="block-5 inline-5" />
					</button>,
					overlay,
				);

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Pointer convenience; the pin and Edit button provide keyboard selection.
		<div
			ref={initCard}
			className={cn(
				"cursor-default rounded-md border bg-(--kui-color-background-surface) p-3 text-(--kui-color-foreground-neutral-emphasis) transition",
				isSelected
					? "border-(--kui-color-alias-border-selected) ring-2 ring-(--kui-color-alias-focus-ring)"
					: "border-(--kui-color-alias-border-idle) hover:border-(--kui-color-alias-border-hovered)",
			)}
			onClick={onSelect}
			role="listitem"
		>
			<NotEditable>
				{marker}
				<div className="flex items-center justify-between gap-x-3">
					<p className="flex-1 truncate text-sm font-medium min-inline-0">
						{value.label || "Untitled hotspot"} ({x.toFixed(1)}%, {y.toFixed(1)}%)
					</p>
					{onEditChildren != null ? (
						<Button onFocus={onSelect} onPress={onEditChildren} prominence="low">
							Edit
						</Button>
					) : null}
				</div>
			</NotEditable>
			{children != null ? (
				<div className="mbs-3 border-bs border-(--kui-color-alias-border-idle) pbs-3 min-block-20">{children}</div>
			) : null}
		</div>
	);
}
