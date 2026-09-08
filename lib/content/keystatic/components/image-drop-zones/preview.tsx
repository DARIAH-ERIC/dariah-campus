"use client";

import { type UseObjectUrlParams, useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { Button } from "@keystar/ui/button";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import { type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useImageOverlay } from "#/lib/content/keystatic/components/use-image-overlay.ts";

interface QuizImageDropZonesPreviewProps {
	alt?: string;
	children: ReactNode;
	src: UseObjectUrlParams | null;
}

export function QuizImageDropZonesPreview(props: Readonly<QuizImageDropZonesPreviewProps>): ReactNode {
	const { alt = "", children, src } = props;

	const url = useObjectUrl(src);

	return (
		<figure className="grid grid-cols-[minmax(0,1fr)] gap-y-3 rounded-md border border-neutral-200 p-3">
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
				<div aria-label="Drop zones" className="grid grid-cols-[minmax(0,1fr)] gap-y-3" role="list">
					{children}
				</div>
			</figcaption>
		</figure>
	);
}

interface Point {
	x: number;
	y: number;
}

interface Box {
	height: number;
	width: number;
	x: number;
	y: number;
}

/** The schema allows no smaller, and a zone below this is impossible to grab again once it has been drawn. */
const minSize = 1;

/** What a zone gets when it is drawn nowhere - large enough to find on the image, small enough not to cover it. */
const fallbackBox: Box = { height: 20, width: 25, x: 0, y: 0 };

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/** Positions are kept to one decimal, which is finer than a pixel on any image the cms shows. */
function round(value: number): number {
	return Math.round(value * 10) / 10;
}

function moveBox(origin: Box, point: Point, grab: Point): Box {
	return {
		height: origin.height,
		width: origin.width,
		x: round(clamp(point.x - grab.x, 0, 100 - origin.width)),
		y: round(clamp(point.y - grab.y, 0, 100 - origin.height)),
	};
}

interface Edges {
	blockEnd?: boolean;
	blockStart?: boolean;
	inlineEnd?: boolean;
	inlineStart?: boolean;
}

/** The edges the handle does not control stay where they are, so the opposite side of the zone acts as the anchor. */
function resizeBox(origin: Box, edges: Edges, point: Point): Box {
	let { height, width, x, y } = origin;

	if (edges.inlineStart === true) {
		const inlineEnd = x + width;
		x = clamp(point.x, 0, inlineEnd - minSize);
		width = inlineEnd - x;
	} else if (edges.inlineEnd === true) {
		width = clamp(point.x - x, minSize, 100 - x);
	}

	if (edges.blockStart === true) {
		const blockEnd = y + height;
		y = clamp(point.y, 0, blockEnd - minSize);
		height = blockEnd - y;
	} else if (edges.blockEnd === true) {
		height = clamp(point.y - y, minSize, 100 - y);
	}

	return { height: round(height), width: round(width), x: round(x), y: round(y) };
}

/** Both corners are already clamped to the image, so the rectangle they span cannot leave it either. */
function drawBox(start: Point, point: Point): Box {
	const x = Math.min(start.x, point.x);
	const y = Math.min(start.y, point.y);

	return {
		height: round(clamp(Math.abs(point.y - start.y), minSize, 100 - y)),
		width: round(clamp(Math.abs(point.x - start.x), minSize, 100 - x)),
		x: round(x),
		y: round(y),
	};
}

/** The rendered size of the image, which is what turns the two percentages into lengths that can be compared. */
interface Bounds {
	blockPx: number;
	inlinePx: number;
}

/**
 * Width and height are percentages of different axes, so equal numbers only describe a square on a square image. The
 * side is settled in pixels and converted back, which keeps a square square and a circle round on any image. `anchor`
 * names the edges the gesture is pulling away from, which therefore stay where they are.
 */
function toSquare(box: Box, anchor: Edges, bounds: Bounds): Box {
	const inlineEnd = box.x + box.width;
	const blockEnd = box.y + box.height;

	/** The longer side wins, so the shape follows the gesture instead of collapsing onto its shorter axis. */
	let side = Math.max((box.width / 100) * bounds.inlinePx, (box.height / 100) * bounds.blockPx);

	/** A square which would reach past the image is shrunk to fit rather than dragged off its anchor. */
	const availableInline = anchor.inlineEnd === true ? inlineEnd : 100 - box.x;
	const availableBlock = anchor.blockEnd === true ? blockEnd : 100 - box.y;
	side = Math.min(side, (availableInline / 100) * bounds.inlinePx, (availableBlock / 100) * bounds.blockPx);
	side = Math.max(side, (minSize / 100) * Math.max(bounds.inlinePx, bounds.blockPx));

	const width = (side / bounds.inlinePx) * 100;
	const height = (side / bounds.blockPx) * 100;

	return {
		height: round(height),
		width: round(width),
		x: round(anchor.inlineEnd === true ? inlineEnd - width : box.x),
		y: round(anchor.blockEnd === true ? blockEnd - height : box.y),
	};
}

const handles: Array<{ cursor: string; edges: Edges; label: string; x: number; y: number }> = [
	{ cursor: "cursor-nwse-resize", edges: { blockStart: true, inlineStart: true }, label: "top left", x: 0, y: 0 },
	{ cursor: "cursor-ns-resize", edges: { blockStart: true }, label: "top", x: 50, y: 0 },
	{ cursor: "cursor-nesw-resize", edges: { blockStart: true, inlineEnd: true }, label: "top right", x: 100, y: 0 },
	{ cursor: "cursor-ew-resize", edges: { inlineStart: true }, label: "left", x: 0, y: 50 },
	{ cursor: "cursor-ew-resize", edges: { inlineEnd: true }, label: "right", x: 100, y: 50 },
	{ cursor: "cursor-nesw-resize", edges: { blockEnd: true, inlineStart: true }, label: "bottom left", x: 0, y: 100 },
	{ cursor: "cursor-ns-resize", edges: { blockEnd: true }, label: "bottom", x: 50, y: 100 },
	{ cursor: "cursor-nwse-resize", edges: { blockEnd: true, inlineEnd: true }, label: "bottom right", x: 100, y: 100 },
];

interface QuizImageDropZoneValue {
	height: number | null;
	items: ReadonlyArray<{ label: string }>;
	label: string;
	shape: "ellipse" | "rectangle";
	width: number | null;
	x: number | null;
	y: number | null;
}

interface Gesture {
	box: Box;
	edges: Edges;
	grab: Point;
	hasMoved: boolean;
	kind: "draw" | "move" | "resize";
	origin: Box;
	pointerId: number;
	start: Point;
}

interface QuizImageDropZoneEditorProps {
	children?: ReactNode;
	isSelected: boolean;
	onChange: (value: QuizImageDropZoneValue) => void;
	onEditChildren?: () => void;
	onSelect: () => void;
	value: QuizImageDropZoneValue;
}

/**
 * The zone is shaped on the image itself: dragged to move, pulled by its handles to resize, and drawn in one gesture
 * while it has no position yet. The number fields stay the precise way in, and the arrow keys the way without a mouse.
 */
export function QuizImageDropZoneEditor(props: Readonly<QuizImageDropZoneEditorProps>): ReactNode {
	const { isSelected, onChange, onEditChildren, onSelect, value } = props;

	const { hasImage, initCard, overlay, size } = useImageOverlay("[data-drop-zone-overlay]");

	const [isPointerOver, setIsPointerOver] = useState(false);
	const [isDrawRequested, setIsDrawRequested] = useState(false);
	/** Held while a gesture is in flight, so the document is written once on release instead of on every move. */
	const [draft, setDraft] = useState<Box | null>(null);
	const gestureRef = useRef<Gesture | null>(null);

	const label = value.label || "Untitled drop zone";
	const isPlaced = value.x != null && value.y != null && value.width != null && value.height != null;
	const box: Box = draft ?? {
		height: value.height ?? fallbackBox.height,
		width: value.width ?? fallbackBox.width,
		x: value.x ?? fallbackBox.x,
		y: value.y ?? fallbackBox.y,
	};

	/**
	 * The same box in the image's own pixels, which is the number an author reads off an image editor. Percentages are of
	 * two different axes, so the two are only proportional to each other on a square image.
	 */
	const boxInPixels =
		size == null || !isPlaced
			? null
			: {
					height: Math.round((box.height / 100) * size.blockPx),
					width: Math.round((box.width / 100) * size.inlinePx),
					x: Math.round((box.x / 100) * size.inlinePx),
					y: Math.round((box.y / 100) * size.blockPx),
				};

	/** A zone with no position is waiting to be drawn, but only the selected one may own the image while it waits. */
	const isDrawing = hasImage && (isDrawRequested || (isSelected && !isPlaced));
	const isHighlighted = isSelected || isPointerOver;

	function getPoint(clientX: number, clientY: number): Point | null {
		if (overlay == null) {
			return null;
		}

		const bounds = overlay.getBoundingClientRect();

		return {
			x: round(clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100)),
			y: round(clamp(((clientY - bounds.top) / bounds.height) * 100, 0, 100)),
		};
	}

	function getBounds(): Bounds | null {
		if (overlay == null) {
			return null;
		}

		const bounds = overlay.getBoundingClientRect();

		return { blockPx: bounds.height, inlinePx: bounds.width };
	}

	function startGesture(event: ReactPointerEvent<HTMLElement>, kind: Gesture["kind"], edges: Edges): void {
		if (event.button !== 0) {
			return;
		}

		const point = getPoint(event.clientX, event.clientY);
		if (point == null) {
			return;
		}

		onSelect();
		event.preventDefault();
		event.stopPropagation();
		event.currentTarget.setPointerCapture(event.pointerId);

		gestureRef.current = {
			box,
			edges,
			grab: { x: point.x - box.x, y: point.y - box.y },
			hasMoved: false,
			kind,
			origin: box,
			pointerId: event.pointerId,
			start: point,
		};
	}

	function applyGesture(event: ReactPointerEvent<HTMLElement>): void {
		const gesture = gestureRef.current;
		if (gesture?.pointerId !== event.pointerId || !event.currentTarget.hasPointerCapture(event.pointerId)) {
			return;
		}

		const point = getPoint(event.clientX, event.clientY);
		if (point == null) {
			return;
		}

		if (point.x !== gesture.start.x || point.y !== gesture.start.y) {
			gesture.hasMoved = true;
		}

		let next =
			gesture.kind === "resize"
				? resizeBox(gesture.origin, gesture.edges, point)
				: gesture.kind === "move"
					? moveBox(gesture.origin, point, gesture.grab)
					: drawBox(gesture.start, point);

		/**
		 * Ctrl or cmd squares the zone off, which is what turns a rectangle into a square and an ellipse into a circle.
		 * Read off the event, so the shape follows the key being held or let go part way through the drag.
		 */
		const bounds = getBounds();
		if ((event.ctrlKey || event.metaKey) && bounds != null && gesture.kind !== "move") {
			const anchor =
				gesture.kind === "draw"
					? { blockEnd: point.y < gesture.start.y, inlineEnd: point.x < gesture.start.x }
					: { blockEnd: gesture.edges.blockStart === true, inlineEnd: gesture.edges.inlineStart === true };

			next = toSquare(next, anchor, bounds);
		}

		gesture.box = next;
		setDraft(next);
	}

	function endGesture(event: ReactPointerEvent<HTMLElement>): void {
		const gesture = gestureRef.current;
		if (gesture?.pointerId !== event.pointerId) {
			return;
		}

		event.currentTarget.releasePointerCapture(event.pointerId);
		gestureRef.current = null;
		setDraft(null);

		/** A click which never moved is how the zone gets selected, and must not resize it to nothing. */
		if (!gesture.hasMoved) {
			return;
		}

		setIsDrawRequested(false);
		onChange({ ...value, height: gesture.box.height, width: gesture.box.width, x: gesture.box.x, y: gesture.box.y });
	}

	const boxStyle = {
		blockSize: `${String(box.height)}%`,
		inlineSize: `${String(box.width)}%`,
		insetBlockStart: `${String(box.y)}%`,
		insetInlineStart: `${String(box.x)}%`,
	} as CSSProperties;

	/** A percentage radius inscribes an ellipse in the box; a length would round it into a stadium instead. */
	const shapeClassName = value.shape === "ellipse" ? "rounded-[50%]" : "rounded-md";

	/** Nothing is drawn before the zone has a position, and nothing at all without an image to position it against. */
	const shape =
		overlay == null || !hasImage || !(isPlaced || draft != null)
			? null
			: createPortal(
					<div
						className={cn("absolute", isHighlighted ? "z-10" : undefined)}
						onPointerEnter={() => {
							setIsPointerOver(true);
						}}
						onPointerLeave={() => {
							setIsPointerOver(false);
						}}
						style={boxStyle}
					>
						<button
							aria-label={`Move drop zone: ${label}. Arrow keys move it, alt and arrow keys resize it.`}
							className={cn(
								"absolute inset-0 flex touch-none border-2 border-dashed transition-colors outline-none",
								shapeClassName,
								value.shape === "ellipse" ? "items-center justify-center" : "items-start justify-start",
								isHighlighted
									? "cursor-move border-solid border-brand-700 bg-brand-50/80"
									: "cursor-move border-brand-700 bg-white/75",
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

								if (movement == null) {
									return;
								}
								event.preventDefault();

								/** Without a mouse the same keys do both jobs, so alt asks for the far edges instead. */
								onChange({
									...value,
									...(event.altKey
										? {
												height: round(clamp(box.height + movement[1]!, minSize, 100 - box.y)),
												width: round(clamp(box.width + movement[0]!, minSize, 100 - box.x)),
											}
										: {
												x: round(clamp(box.x + movement[0]!, 0, 100 - box.width)),
												y: round(clamp(box.y + movement[1]!, 0, 100 - box.height)),
											}),
								});
							}}
							onPointerDown={(event) => {
								startGesture(event, "move", {});
							}}
							onPointerMove={applyGesture}
							onPointerUp={endGesture}
							type="button"
						>
							<span className="truncate p-1 text-xs font-medium text-brand-900">{label}</span>
						</button>

						{/* Pointer shortcuts for what alt and the arrow keys already do, so they stay out of the tab order. */}
						{isHighlighted
							? handles.map((handle) => (
									<span
										key={handle.label}
										aria-hidden={true}
										className={cn(
											"absolute -translate-1/2 touch-none rounded-xs border border-white bg-brand-700 block-2.5 inline-2.5",
											handle.cursor,
										)}
										onPointerDown={(event) => {
											startGesture(event, "resize", handle.edges);
										}}
										onPointerMove={applyGesture}
										onPointerUp={endGesture}
										style={{
											insetBlockStart: `${String(handle.y)}%`,
											insetInlineStart: `${String(handle.x)}%`,
										}}
									/>
								))
							: null}
					</div>,
					overlay,
				);

	const drawSurface =
		overlay == null || !isDrawing
			? null
			: createPortal(
					/* Pointer shortcut; the number fields and the arrow keys place a zone without ever drawing one. */
					<div
						className="absolute inset-0 z-20 grid cursor-crosshair place-items-center bg-brand-900/10"
						onPointerDown={(event) => {
							startGesture(event, "draw", {});
						}}
						onPointerMove={applyGesture}
						onPointerUp={endGesture}
					>
						{draft == null ? (
							<span className="rounded-md bg-brand-900/80 px-2 py-1 text-xs font-medium text-white">
								Drag to draw {label}, holding ctrl or cmd for a {value.shape === "ellipse" ? "circle" : "square"}
							</span>
						) : null}
					</div>,
					overlay,
				);

	return (
		// oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Pointer convenience; the shape and the Edit button provide keyboard selection.
		<div
			ref={initCard}
			className={cn(
				"cursor-default rounded-md border bg-(--kui-color-background-surface) p-3 text-(--kui-color-foreground-neutral-emphasis) transition",
				isHighlighted
					? "border-(--kui-color-alias-border-selected) ring-2 ring-(--kui-color-alias-focus-ring)"
					: "border-(--kui-color-alias-border-idle) hover:border-(--kui-color-alias-border-hovered)",
			)}
			onClick={onSelect}
			onPointerEnter={() => {
				setIsPointerOver(true);
			}}
			onPointerLeave={() => {
				setIsPointerOver(false);
			}}
			role="listitem"
		>
			<NotEditable>
				{shape}
				{drawSurface}

				<div className="flex items-center justify-between gap-x-3">
					<p className="flex-1 text-sm font-medium min-inline-0">
						{label}{" "}
						{isPlaced ? (
							<span className="font-normal text-(--kui-color-foreground-neutral-secondary)">
								{value.shape === "ellipse" ? "ellipse" : "rectangle"} at {box.x}%, {box.y}%, {box.width}
								&nbsp;&times; {box.height}%
								{boxInPixels != null ? (
									<>
										{" "}
										&asymp; {boxInPixels.x}, {boxInPixels.y}, {boxInPixels.width}&nbsp;&times; {boxInPixels.height}
										&nbsp;px
									</>
								) : null}
							</span>
						) : (
							<span className="font-normal text-(--kui-color-foreground-neutral-secondary)">
								{hasImage ? "not placed yet" : "laid out in a grid"}
							</span>
						)}
					</p>

					{hasImage ? (
						<Button
							onPress={() => {
								onSelect();
								setIsDrawRequested(true);
							}}
							prominence="low"
						>
							{isPlaced ? "Redraw" : "Draw"}
						</Button>
					) : null}

					{onEditChildren != null ? (
						<Button onFocus={onSelect} onPress={onEditChildren} prominence="low">
							Edit
						</Button>
					) : null}
				</div>

				<p className="text-sm text-(--kui-color-foreground-neutral-secondary)">
					{value.items.length > 0 ? value.items.map((item) => item.label).join(", ") : "No items belong in this zone."}
				</p>
			</NotEditable>
		</div>
	);
}
