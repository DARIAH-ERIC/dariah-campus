"use client";

import cn from "clsx/lite";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";
import { useCollator, useFilter } from "react-aria";
import {
	Autocomplete,
	Button,
	Dialog,
	DialogTrigger,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	ListLayout,
	Popover,
	SearchField,
	Virtualizer,
} from "react-aria-components";

import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";
import type { FacetAttribute } from "#/app/(app)/(default)/search/_lib/search.ts";
import { maxUnfilteredFacetValues } from "#/configs/search.config.ts";

interface FacetItem {
	/** `undefined` while the count for a refinement restored from the url is not yet known. */
	count: number | undefined;
	value: string;
}

/** Measured from the rendered rows: a bare label, and a label above a description clamped to two lines. */
const rowSize = 32;
const estimatedRowSizeWithDescription = 56;
const rowGap = 2;

interface FilterableProps {
	children: ReactNode;
	isFilterable: boolean;
	renderFilter: () => ReactNode;
}

/**
 * Wraps the list in an autocomplete, whose filter input is only worth the space when the list is long enough to be
 * worth narrowing. Without it the list keeps real focus instead of the autocomplete's virtual focus.
 */
function Filterable(props: Readonly<FilterableProps>): ReactNode {
	const { children, isFilterable, renderFilter } = props;

	const { contains } = useFilter({ sensitivity: "base" });

	if (!isFilterable) {
		return children;
	}

	return (
		<Autocomplete filter={contains}>
			{renderFilter()}
			{children}
		</Autocomplete>
	);
}

interface SearchFacetFilterProps {
	attribute: FacetAttribute;
	/** Optional supporting text per value, rendered under its label. Not matched against the filter input. */
	getDescription?: ((id: string) => string | undefined) | undefined;
	getLabel: (id: string) => string;
	label: string;
}

export function SearchFacetFilter(props: Readonly<SearchFacetFilterProps>): ReactNode {
	const { attribute, getDescription, getLabel, label } = props;

	const t = useTranslations("SearchPage");
	const format = useFormatter();
	const { facets, isLoading, selectedFilters, setFilter } = useSearch();
	const collator = useCollator({ sensitivity: "base", usage: "sort" });
	const selected = selectedFilters[attribute];
	/**
	 * Selected values are pinned to the top, but only as of the moment the popover was opened, so the list does not
	 * reorder underneath the pointer or the keyboard cursor while values are being toggled.
	 */
	const [pinned, setPinned] = useState<ReadonlySet<string>>(new Set());
	const items = useMemo(() => {
		const itemsByValue = new Map<string, FacetItem>(
			facets[attribute].values.map((item) => [item.value, { count: item.count, value: item.value }] as const),
		);
		/** A refinement restored from the url may not occur in the current result set. */
		for (const value of selected) {
			if (!itemsByValue.has(value)) {
				itemsByValue.set(value, { count: isLoading ? undefined : 0, value });
			}
		}

		return Array.from(itemsByValue.values()).toSorted((a, b) => {
			const pinnedDifference = Number(pinned.has(b.value)) - Number(pinned.has(a.value));
			if (pinnedDifference !== 0) {
				return pinnedDifference;
			}

			const countDifference = (b.count ?? -1) - (a.count ?? -1);
			if (countDifference !== 0) {
				return countDifference;
			}

			return collator.compare(getLabel(a.value), getLabel(b.value));
		});
	}, [attribute, collator, facets, getLabel, isLoading, pinned, selected]);
	const isFilterable = items.length > maxUnfilteredFacetValues;
	/**
	 * Only the visible rows are mounted, because a facet such as people runs to several hundred values. Rows carrying a
	 * description vary in height and have to be measured, the rest are uniform and can be placed outright.
	 */
	const layoutOptions = useMemo(
		() =>
			getDescription == null
				? { rowSize, gap: rowGap }
				: { estimatedRowSize: estimatedRowSizeWithDescription, gap: rowGap },
		[getDescription],
	);

	return (
		<DialogTrigger
			onOpenChange={(isOpen) => {
				if (isOpen) {
					setPinned(new Set(selected));
				}
			}}
		>
			<Button
				className={cn(
					"flex items-center gap-x-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition",
					"focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2",
					selected.length > 0
						? "border-brand-700 bg-brand-50 text-brand-800"
						: "border-neutral-300 bg-white hover:border-neutral-400",
				)}
			>
				<span>{label}</span>
				{selected.length > 0 ? (
					<span className="rounded-full bg-brand-700 px-1.5 text-xs text-white tabular-nums">
						{format.number(selected.length)}
					</span>
				) : null}
				<ChevronDownIcon aria-hidden={true} className="text-neutral-500 block-4 inline-4" />
			</Button>

			<Popover
				className={cn(
					"rounded-lg border border-neutral-200 bg-white shadow-lg outline-none inline-[min(100vw-2rem,20rem)]",
					"entering:animate-in entering:duration-150 entering:ease-out entering:fade-in",
					"exiting:animate-out exiting:duration-100 exiting:ease-in exiting:fade-out",
				)}
				placement="bottom start"
			>
				<Dialog aria-label={label} className="grid gap-y-2 p-2 outline-none">
					<Filterable
						isFilterable={isFilterable}
						renderFilter={() => (
							<SearchField autoFocus={true}>
								<Label className="sr-only">{t("filter-label", { attribute: label })}</Label>
								<Input
									className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm inline-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
									placeholder={t("filter-placeholder")}
								/>
							</SearchField>
						)}
					>
						<Virtualizer layout={ListLayout} layoutOptions={layoutOptions}>
							<ListBox
								aria-label={label}
								/** Without a filter input to hold it, focus belongs to the list itself. */
								autoFocus={!isFilterable}
								className="block overflow-y-auto outline-none max-block-72"
								/** Escape belongs to the popover here - without this it would clear the refinement instead of closing. */
								escapeKeyBehavior="none"
								items={items}
								onSelectionChange={(keys) => {
									setFilter(
										attribute,
										keys === "all" ? items.map((item) => item.value) : (Array.from(keys) as Array<string>),
									);
								}}
								renderEmptyState={() => (
									<div className="px-2 py-4 text-center text-sm text-neutral-600">{t("nothing-found")}</div>
								)}
								selectedKeys={selected}
								selectionMode="multiple"
							>
								{(item) => (
									<ListBoxItem
										className="group flex cursor-pointer items-start gap-x-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-neutral-100 focus:bg-neutral-100"
										id={item.value}
										textValue={getLabel(item.value)}
									>
										{({ isSelected }) => {
											const description = getDescription?.(item.value);

											return (
												<>
													<span className="pointer-events-none mbs-0.5 flex shrink-0 items-center justify-center self-start rounded-xs border border-neutral-400 block-4 inline-4 group-selected:border-brand-700 group-selected:bg-brand-700">
														{isSelected ? (
															<CheckIcon aria-hidden={true} className="text-white block-3 inline-3" />
														) : null}
													</span>
													<span className="grid grow gap-y-0.5">
														<span className="flex items-baseline gap-x-2">
															<span className="grow">{getLabel(item.value)}</span>
															{item.count === undefined ? null : (
																<span className="text-xs text-neutral-500 tabular-nums">
																	{format.number(item.count)}
																</span>
															)}
														</span>
														{description == null || description === "" ? null : (
															<span className="line-clamp-2 text-xs text-neutral-500">{description}</span>
														)}
													</span>
												</>
											);
										}}
									</ListBoxItem>
								)}
							</ListBox>
						</Virtualizer>
					</Filterable>
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
