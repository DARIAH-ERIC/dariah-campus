"use client";

import { ArrowUpRightIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { StaticImageData } from "next/image";
import { type Key, type ReactNode, useMemo } from "react";
import { Button, Tag, TagGroup, TagList } from "react-aria-components";

import { SearchFacetFilter } from "#/app/(app)/(default)/search/_components/search-facet-filter.tsx";
import { SearchFacetValueInfo } from "#/app/(app)/(default)/search/_components/search-facet-value-info.tsx";
import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";
import { type FacetAttribute, facetAttributes } from "#/app/(app)/(default)/search/_lib/search.ts";
import { Link } from "#/components/link.tsx";

interface FacetConfig {
	getDescription?: ((id: string) => string | undefined) | undefined;
	getLabel: (id: string) => string;
	label: string;
}

interface SearchFilterBarProps {
	contentTypesById: Map<string, { label: string }>;
	localesById: Map<string, { label: string }>;
	peopleById: Map<string, { description: string; image: StaticImageData | string; name: string }>;
	sourcesById: Map<string, { name: string }>;
	tagsById: Map<string, { description: string; name: string }>;
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
				/** Approach 1: topics explain themselves in the listbox, where the value is picked. */
				getDescription: (id: string) => tagsById.get(id)?.description,
			},
			"content-type": {
				label: t("content-types"),
				getLabel: (id: string) => contentTypesById.get(id)?.label ?? "Unknown content type",
			},
			people: {
				label: t("people"),
				getLabel: (id: string) => peopleById.get(id)?.name ?? "Unknown person",
			},
			sources: {
				label: t("sources"),
				getLabel: (id: string) => sourcesById.get(id)?.name ?? "Unknown source",
			},
		};
	}, [contentTypesById, localesById, peopleById, sourcesById, t, tagsById]);

	const tags = facetAttributes.flatMap((attribute) =>
		selectedFilters[attribute].map((value) => {
			return {
				attribute,
				id: createTagId(attribute, value),
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
			<div className="-mx-4 flex gap-2 overflow-x-auto px-4 pbe-1 xs:mx-0 xs:flex-wrap xs:px-0 xs:pbe-0">
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
				<div className="flex flex-wrap items-center gap-2">
					<TagGroup aria-label={t("selected-filters")} onRemove={onRemove}>
						<TagList className="flex flex-wrap gap-2" items={tags}>
							{(tag) => {
								const person = tag.attribute === "people" ? peopleById.get(tag.value) : undefined;

								return (
									<Tag
										className="flex items-center gap-x-1.5 rounded-full border border-neutral-300 bg-neutral-50 py-1 ps-3 pe-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
										textValue={`${tag.name}: ${tag.label}`}
									>
										<span className="text-neutral-500">{tag.name}</span>
										<span>{tag.label}</span>

										{/** Approach 2: people have no page of their own, so context comes from a popover on the chip. */}
										{person == null ? null : (
											<SearchFacetValueInfo
												description={person.description}
												image={person.image}
												label={t("about-value", { value: tag.label })}
												name={person.name}
											/>
										)}

										{/** Approach 3: sources do have a page, so the chip carries a real link to it. */}
										{tag.attribute === "sources" ? (
											<Link
												className="rounded-full p-0.5 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
												href={`/sources/${tag.value}`}
											>
												<span className="sr-only">{t("open-value-page", { value: tag.label })}</span>
												<ArrowUpRightIcon aria-hidden={true} className="block-4 inline-4" />
											</Link>
										) : null}

										{/** React Aria labels this button from the tag's `textValue`, so it needs no text of its own. */}
										<Button
											className="rounded-full p-0.5 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
											slot="remove"
										>
											<XIcon aria-hidden={true} className="block-4 inline-4" />
										</Button>
									</Tag>
								);
							}}
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
