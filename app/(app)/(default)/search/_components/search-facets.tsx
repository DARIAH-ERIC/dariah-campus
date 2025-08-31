"use client";

import { Fragment, type ReactNode } from "react";
import { Button } from "react-aria-components";
import { useRefinementList } from "react-instantsearch-core";

interface SearchFacetsProps {
	attribute: "content-type" | "locale" | "people" | "sources" | "tags";
	filterLabel: string;
	filterPlaceholder: string;
	getLabel: (id: string) => string;
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
		nothingFoundLabel,
		showLessLabel,
		showMoreLabel,
	} = props;

	const facets = useRefinementList({
		attribute,
		limit: 15,
		showMore: true,
		showMoreLimit: 25,
	});

	return (
		<Fragment>
			{!facets.hasExhaustiveItems ? (
				<label>
					<span className="sr-only">{filterLabel}</span>
					<input
						className="mb-1 w-full rounded-md border border-neutral-300 px-3 py-1 focus-visible:ring focus-visible:ring-brand-700"
						onChange={(event) => {
							facets.searchForItems(event.currentTarget.value);
						}}
						placeholder={filterPlaceholder}
					/>
				</label>
			) : null}

			{facets.items.length > 0 ? (
				<Fragment>
					<ul className="grid gap-y-1 accent-brand-700" role="list">
						{facets.items.map((item) => {
							function onChange() {
								facets.refine(item.value);
							}

							return (
								<li key={item.value} className="flex">
									<label className="inline-flex gap-x-2">
										<input
											checked={item.isRefined}
											name={attribute}
											onChange={onChange}
											type="checkbox"
											value={item.value}
										/>
										<span>
											{getLabel(item.label)} ({item.count})
										</span>
									</label>
								</li>
							);
						})}
					</ul>

					{facets.canToggleShowMore ? (
						<Button
							className="rounded-md py-1 text-sm text-neutral-600	transition hover:text-brand-700 focus-visible:ring focus-visible:ring-brand-700"
							onPress={() => {
								facets.toggleShowMore();
							}}
						>
							{facets.isShowingMore ? showLessLabel : showMoreLabel}
						</Button>
					) : null}
				</Fragment>
			) : (
				<div className="text-neutral-600">{nothingFoundLabel}</div>
			)}
		</Fragment>
	);
}
