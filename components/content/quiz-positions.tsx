"use client";

import type { ReactNode } from "react";
import { Menu, MenuItem, Popover } from "react-aria-components";

/** Puts the entry at the position, shifting whatever sat between the two along by one. */
export function moveTo(order: Array<number>, entry: number, position: number): Array<number> {
	const next = order.filter((current) => current !== entry);
	next.splice(position, 0, entry);
	return next;
}

interface PositionMenuProps {
	/** The position the entry holds now, which is the one place it cannot be moved to. */
	current: number;
	/** Names a position for the menu, one-based. */
	label: (position: number) => string;
	onMove: (position: number) => void;
	total: number;
}

/**
 * The positions an entry can be moved to, opened from the entry itself. This is the path keyboard and touch users take,
 * and what WCAG 2.5.7 asks for: every drag has to be achievable by a single pointer without dragging.
 *
 * Rendered inside a `MenuTrigger` whose trigger is the entry, so the menu is named after it by react-aria - which
 * already reads as "<entry>, position 2 of 5. Choose a position.", and a label of its own would only be overridden.
 */
export function PositionMenu(props: Readonly<PositionMenuProps>): ReactNode {
	const { current, label, onMove, total } = props;

	return (
		<Popover
			className="rounded-md border border-neutral-200 bg-white py-1 shadow-md min-inline-32"
			offset={4}
			placement="bottom start"
		>
			<Menu
				className="outline-none"
				disabledKeys={[String(current)]}
				onAction={(key) => {
					onMove(Number(key));
				}}
			>
				{Array.from({ length: total }, (_, position) => (
					<MenuItem
						key={position}
						className="cursor-pointer px-3 py-1 text-sm text-neutral-700 outline-none focus:bg-brand-50 focus:text-brand-700 disabled:cursor-default disabled:text-neutral-400"
						id={String(position)}
						textValue={label(position + 1)}
					>
						{label(position + 1)}
					</MenuItem>
				))}
			</Menu>
		</Popover>
	);
}
