"use client";

import { Button } from "@keystar/ui/button";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import type { ReactNode } from "react";

interface QuizOrderingPreviewProps {
	children: ReactNode;
}

export function QuizOrderingPreview(props: Readonly<QuizOrderingPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<div className="grid grid-cols-[minmax(0,1fr)] gap-y-3 rounded-md border border-neutral-200 p-3">
			<NotEditable>
				<p className="text-xs text-neutral-500">
					The order the items are listed in here is the correct one. Users see them shuffled.
				</p>
			</NotEditable>

			<div aria-label="Items" className="grid grid-cols-[minmax(0,1fr)] gap-y-3" role="list">
				{children}
			</div>
		</div>
	);
}

interface QuizOrderingItemValue {
	label: string;
}

interface QuizOrderingItemEditorProps {
	children?: ReactNode;
	isSelected: boolean;
	onChange: (value: QuizOrderingItemValue) => void;
	onEditChildren?: () => void;
	onSelect: () => void;
	value: QuizOrderingItemValue;
}

/**
 * The item's text is a field rather than content, so without a view of its own the card would only read "Item" and
 * offer an Edit button - and a list of those cannot be put in order.
 */
export function QuizOrderingItemEditor(props: Readonly<QuizOrderingItemEditorProps>): ReactNode {
	const { isSelected, onEditChildren, onSelect, value } = props;

	const label = value.label || "Untitled item";

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
			</NotEditable>
		</div>
	);
}
