"use client";

import { ArrowUpRightIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Key, type ReactNode, useMemo } from "react";
import { Button, Tag, TagGroup, TagList } from "react-aria-components";

import { SearchFacetFilter } from "#/app/(app)/(default)/search/_components/search-facet-filter.tsx";
import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";
import { type FacetAttribute, facetAttributes } from "#/app/(app)/(default)/search/_lib/search.ts";
import { Link } from "#/components/link.tsx";

interface FacetConfig {
	getDescription?: ((id: string) => string | undefined) | undefined;
	/** Values with a page of their own, which an active refinement links to. */
	getHref?: ((id: string) => string | undefined) | undefined;
	getLabel: (id: string) => string;
	label: string;
}

interface SearchFilterBarProps {
	contentTypesById: Map<string, { label: string }>;
	localesById: Map<string, { label: string }>;
	peopleById: Map<string, { href: string; name: string }>;
	sourcesById: Map<string, { href: string; name: string }>;
	tagsById: Map<string, { description: string; href: string; name: string }>;
}

/** `:` never occurs in a facet attribute, so the first one separates attribute from value. */
const separator = ":";

function createTagId(attribute: FacetAttribute, value: string): string {
	return `${attribute}${separator}${value}`;
}

function parseTagId(id: string): { attribute: FacetAttribute; value: string } {
	const index = id.indexOf(separator);

	return { attribute: id.slice(0, index) as FacetAttribute, value: id.slice(index + 1) };
}

export function SearchFilterBar(props: Readonly<SearchFilterBarProps>): ReactNode {
	const { contentTypesById, localesById, peopleById, sourcesById, tagsById } = props;

	const t = useTranslations("SearchPage");
	const { clearFilters, selectedFilters, setFilter } = useSearch();

	const facets = useMemo<Record<FacetAttribute, FacetConfig>>(() => {
		return {
			locale: {
				label: t("locale"),
				getLabel: (id: string) => localesById.get(id)?.label ?? "Unknown language",
			},
			tags: {
				label: t("tags"),
				getLabel: (id: string) => tagsById.get(id)?.name ?? "Unknown tag",
				/** Topics explain themselves in the listbox, where the value is picked. */
				getDescription: (id: string) => tagsById.get(id)?.description,
				getHref: (id: string) => tagsById.get(id)?.href,
			},
			"content-type": {
				label: t("content-types"),
				getLabel: (id: string) => contentTypesById.get(id)?.label ?? "Unknown content type",
			},
			people: {
				label: t("people"),
				getLabel: (id: string) => peopleById.get(id)?.name ?? "Unknown person",
				getHref: (id: string) => peopleById.get(id)?.href,
			},
			sources: {
				label: t("sources"),
				getLabel: (id: string) => sourcesById.get(id)?.name ?? "Unknown source",
				getHref: (id: string) => sourcesById.get(id)?.href,
			},
		};
	}, [contentTypesById, localesById, peopleById, sourcesById, t, tagsById]);

	const tags = facetAttributes.flatMap((attribute) =>
		selectedFilters[attribute].map((value) => {
			return {
				attribute,
				id: createTagId(attribute, value),
				href: facets[attribute].getHref?.(value),
				label: facets[attribute].getLabel(value),
				name: facets[attribute].label,
				value,
			};
		}),
	);

	function onRemove(keys: Set<Key>) {
		const removedByAttribute = new Map<FacetAttribute, Set<string>>();

		for (const key of keys) {
			const { attribute, value } = parseTagId(String(key));
			const values = removedByAttribute.get(attribute) ?? new Set();
			values.add(value);
			removedByAttribute.set(attribute, values);
		}

		for (const [attribute, values] of removedByAttribute) {
			setFilter(
				attribute,
				selectedFilters[attribute].filter((value) => !values.has(value)),
			);
		}
	}

	return (
		<div className="grid gap-y-3">
			{/**
			 * The row only scrolls where it cannot wrap. `overflow-x` other than visible also clips the block axis, so the
			 * scrolling state pads by the width of a focus ring and takes it back off as margin, and the wrapping state stops
			 * clipping altogether - otherwise a trigger's focus ring is cut off against the edge of the row.
			 */}
			<div className="-mx-4 -mbs-1 -mbe-1 flex gap-2 overflow-x-auto px-4 pbs-1 pbe-1 xs:mx-0 xs:flex-wrap xs:justify-center xs:overflow-x-visible xs:px-0">
				{facetAttributes.map((attribute) => (
					<SearchFacetFilter
						key={attribute}
						attribute={attribute}
						getDescription={facets[attribute].getDescription}
						getLabel={facets[attribute].getLabel}
						label={facets[attribute].label}
					/>
				))}
			</div>

			{tags.length > 0 ? (
				<div className="flex flex-wrap items-center justify-center gap-2">
					<TagGroup aria-label={t("selected-filters")} onRemove={onRemove}>
						<TagList className="flex flex-wrap gap-2" items={tags}>
							{(tag) => (
								<Tag
									className="flex items-center gap-x-1.5 rounded-full border border-neutral-300 bg-neutral-50 py-1 ps-3 pe-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
									textValue={`${tag.name}: ${tag.label}`}
								>
									<span className="text-neutral-500">{tag.name}</span>
									<span>{tag.label}</span>

									{/** People, topics and sources each have a page of their own to read up on the value. */}
									{tag.href == null ? null : (
										<Link
											className="rounded-full p-0.5 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
											href={tag.href}
										>
											<span className="sr-only">{t("open-value-page", { value: tag.label })}</span>
											<ArrowUpRightIcon aria-hidden={true} className="block-4 inline-4" />
										</Link>
									)}

									{/** React Aria labels this button from the tag's `textValue`, so it needs no text of its own. */}
									<Button
										className="rounded-full p-0.5 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
										slot="remove"
									>
										<XIcon aria-hidden={true} className="block-4 inline-4" />
									</Button>
								</Tag>
							)}
						</TagList>
					</TagGroup>

					<Button
						className="rounded-md px-2 py-1 text-sm text-neutral-600 underline transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
						onPress={clearFilters}
					>
						{t("clear-filters")}
					</Button>
				</div>
			) : null}
		</div>
	);
}
