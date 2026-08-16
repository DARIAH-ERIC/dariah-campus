"use client";

import { CheckIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { type ReactNode, useId, useMemo, useState } from "react";
import { useCollator } from "react-aria";
import { Button, Checkbox, CheckboxGroup, Input, Label, SearchField } from "react-aria-components";

import { useSearch } from "@/app/(app)/(default)/search/_components/search-provider";
import type { FacetAttribute } from "@/app/(app)/(default)/search/_lib/typesense";
import { defaultVisibleFacets, maxVisibleFacets } from "@/config/search.config";

interface SearchFacetsProps {
	attribute: FacetAttribute;
	filterLabel: string;
	filterPlaceholder: string;
	getLabel: (id: string) => string;
	label: string;
	nothingFoundLabel: string;
	showLessLabel: string;
	showMoreLabel: string;
}

export function SearchFacets(props: Readonly<SearchFacetsProps>): ReactNode {
	const {
		attribute,
		filterLabel,
		filterPlaceholder,
		getLabel,
		label,
		nothingFoundLabel,
		showLessLabel,
		showMoreLabel,
	} = props;
	const { facets, isLoading, selectedFilters, setFilter: setSearchFilter } = useSearch();
	const format = useFormatter();
	const [filter, setFilter] = useState("");
	const [isShowingMore, setIsShowingMore] = useState(false);
	const collator = useCollator({ sensitivity: "base", usage: "sort" });
	const labelId = useId();
	const selected = selectedFilters[attribute];
	const items = useMemo(() => {
		const valuesById = new Map<string, { count: number | undefined; value: string }>(
			facets[attribute].map((item) => {
				return [item.value, item] as const;
			}),
		);
		for (const value of selected) {
			if (!valuesById.has(value)) {
				valuesById.set(value, { count: isLoading ? undefined : 0, value });
			}
		}

		const selectedValues = new Set(selected);
		const normalizedFilter = filter.trim().toLocaleLowerCase();
		return Array.from(valuesById.values())
			.filter((item) => {
				return getLabel(item.value).toLocaleLowerCase().includes(normalizedFilter);
			})
			.toSorted((a, b) => {
				const selectedDifference =
					Number(selectedValues.has(b.value)) - Number(selectedValues.has(a.value));
				if (selectedDifference !== 0) return selectedDifference;

				const countDifference = (b.count ?? -1) - (a.count ?? -1);
				if (countDifference !== 0) return countDifference;

				return collator.compare(getLabel(a.value), getLabel(b.value));
			});
	}, [facets, attribute, collator, filter, getLabel, isLoading, selected]);
	const visibleLimit = isShowingMore ? maxVisibleFacets : defaultVisibleFacets;
	const visibleItems = items.slice(0, visibleLimit);
	const canToggleShowMore = items.length > defaultVisibleFacets;

	return (
		<div className="grid gap-y-1.5">
			<h3 className="text-sm font-bold tracking-widest text-neutral-600 uppercase" id={labelId}>
				{label}
			</h3>

			{facets[attribute].length > defaultVisibleFacets ? (
				<SearchField className="mb-1" onChange={setFilter} value={filter}>
					<Label className="sr-only">{filterLabel}</Label>
					<Input
						className="w-full rounded-md border border-neutral-300 px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
						placeholder={filterPlaceholder}
					/>
				</SearchField>
			) : null}

			<CheckboxGroup
				aria-labelledby={labelId}
				className="grid gap-y-1"
				onChange={(values) => {
					setSearchFilter(attribute, values);
				}}
				value={selected}
			>
				{visibleItems.length > 0 ? (
					<>
						{visibleItems.map((item) => {
							return (
								<Checkbox
									key={item.value}
									className="group flex items-center gap-x-2 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
									value={item.value}
								>
									{({ isSelected }) => {
										return (
											<>
												<span className="pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-xs border border-neutral-400 group-selected:border-brand-700 group-selected:bg-brand-700">
													{isSelected ? (
														<CheckIcon aria-hidden={true} className="size-3 text-white" />
													) : null}
												</span>
												<span>
													{getLabel(item.value)}
													{item.count === undefined ? null : ` (${format.number(item.count)})`}
												</span>
											</>
										);
									}}
								</Checkbox>
							);
						})}
					</>
				) : null}
			</CheckboxGroup>

			{visibleItems.length === 0 ? (
				<div className="text-neutral-600">{nothingFoundLabel}</div>
			) : null}

			{canToggleShowMore ? (
				<Button
					className="rounded-md py-1 text-sm text-neutral-600 transition hover:text-brand-700 focus-visible:ring focus-visible:ring-brand-700"
					onPress={() => {
						setIsShowingMore((value) => {
							return !value;
						});
					}}
				>
					{isShowingMore ? showLessLabel : showMoreLabel}
				</Button>
			) : null}
		</div>
	);
}
