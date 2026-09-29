"use client";

import { Button } from "@keystar/ui/button";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import type { ReactNode } from "react";

interface QuizMatchingPreviewProps {
	children: ReactNode;
	orderedZones: boolean;
}

export function QuizMatchingPreview(props: Readonly<QuizMatchingPreviewProps>): ReactNode {
	const { children, orderedZones } = props;

	return (
		<div className="grid grid-cols-[minmax(0,1fr)] gap-y-3 rounded-md border border-neutral-200 p-3">
			<NotEditable>
				<p className="text-xs text-neutral-500">
					{orderedZones
						? "The order the zones are listed in here is the correct one. Users see them shuffled, and put them back in order as well as filling them."
						: "The zones are laid out in a grid, in the order they are listed in here."}
				</p>
			</NotEditable>

			<div aria-label="Zones" className="grid grid-cols-[minmax(0,1fr)] gap-y-3" role="list">
				{children}
			</div>
		</div>
	);
}

interface QuizMatchingZoneValue {
	items: ReadonlyArray<{ label: string }>;
	label: string;
}

interface QuizMatchingZoneEditorProps {
	children?: ReactNode;
	isSelected: boolean;
	onChange: (value: QuizMatchingZoneValue) => void;
	onEditChildren?: () => void;
	onSelect: () => void;
	value: QuizMatchingZoneValue;
}

/**
 * The zone's label and items are fields rather than content, so without a view of its own the card would only read
 * "Zone" and offer an Edit button - and a list of those cannot be put in order.
 */
export function QuizMatchingZoneEditor(props: Readonly<QuizMatchingZoneEditorProps>): ReactNode {
	const { isSelected, onEditChildren, onSelect, value } = props;

	const label = value.label || "Untitled zone";

	return (
		// oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Pointer convenience; the Edit button provides keyboard selection.
		<div
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
				<div className="flex items-center justify-between gap-x-3">
					<p className="flex-1 text-sm font-medium min-inline-0">{label}</p>

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
