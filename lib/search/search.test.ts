import { describe, expect, it } from "vitest";

import { mapFacets, serializeFilter, serializeSort, toRecord } from "#/lib/search/search.ts";

describe("serializeFilter", () => {
	it("returns undefined when nothing refines the search", () => {
		expect(serializeFilter(undefined)).toBeUndefined();
		expect(serializeFilter({})).toBeUndefined();
		expect(serializeFilter({ tags: [] })).toBeUndefined();
	});

	it("ors the values within a facet and ands separate facets", () => {
		expect(serializeFilter({ tags: ["a", "b"] })).toBe("tags:=[`a`,`b`]");
		expect(serializeFilter<"locale" | "tags">({ locale: ["en"], tags: ["a"] })).toBe("locale:=[`en`] && tags:=[`a`]");
	});

	/**
	 * Both fields and values are commutative, so equivalent refinements have to serialize identically - otherwise the
	 * same selection misses the typesense result cache purely because the url listed it in a different order.
	 */
	it("serializes equivalent refinements identically regardless of input order", () => {
		expect(serializeFilter<"locale" | "tags">({ tags: ["b", "a"], locale: ["en"] })).toBe(
			serializeFilter<"locale" | "tags">({ locale: ["en"], tags: ["a", "b"] }),
		);
	});

	it("escapes backticks and backslashes in values", () => {
		expect(serializeFilter({ tags: ["a`b"] })).toBe("tags:=[`a\\`b`]");
		expect(serializeFilter({ tags: ["a\\b"] })).toBe("tags:=[`a\\\\b`]");
	});

	/** Omitting a field's own refinements is how disjunctive facet counts are obtained. */
	it("omits the requested field", () => {
		expect(serializeFilter<"locale" | "tags">({ locale: ["en"], tags: ["a"] }, undefined, "tags")).toBe(
			"locale:=[`en`]",
		);
		expect(serializeFilter({ tags: ["a"] }, undefined, "tags")).toBeUndefined();
	});

	it("appends an additional filter expression as its own group", () => {
		expect(serializeFilter({ tags: ["a"] }, "publication-timestamp:>0")).toBe(
			"tags:=[`a`] && (publication-timestamp:>0)",
		);
		expect(serializeFilter(undefined, "publication-timestamp:>0")).toBe("(publication-timestamp:>0)");
		expect(serializeFilter({ tags: ["a"] }, "")).toBe("tags:=[`a`]");
	});
});

describe("serializeSort", () => {
	it("returns undefined when there is nothing to sort by", () => {
		expect(serializeSort(undefined)).toBeUndefined();
		expect(serializeSort([])).toBeUndefined();
	});

	it("formats each sort as field:direction, preserving precedence", () => {
		expect(
			serializeSort([
				{ field: "title", direction: "asc" },
				{ field: "id", direction: "desc" },
			]),
		).toEqual(["title:asc", "id:desc"]);
	});
});

describe("toRecord", () => {
	it("builds one entry per key", () => {
		expect(toRecord(["a", "b"], (key) => key.toUpperCase())).toEqual({ a: "A", b: "B" });
	});

	it("returns an empty record for no keys", () => {
		expect(toRecord([], () => null)).toEqual({});
	});
});

describe("mapFacets", () => {
	const counts = [{ count: 2, highlighted: "en", value: "en" }];

	it("collects counts per field, across the several responses they may arrive in", () => {
		const facets = mapFacets(
			["locale", "tags"],
			[
				{ field_name: "tags", counts: [], sampled: true, stats: { total_values: 0 } },
				{ field_name: "locale", counts, sampled: false, stats: { total_values: 1 } },
			],
		);

		expect(facets.locale.values).toEqual(counts);
		expect(facets.locale.sampled).toBe(false);
		expect(facets.locale.stats.totalValues).toBe(1);
		expect(facets.tags.sampled).toBe(true);
	});

	/** A facet with no matching values is still expected to be present, so the ui can render an empty list. */
	it("yields an empty facet for a requested field which is missing from the response", () => {
		const facets = mapFacets(["locale"], []);

		expect(facets.locale).toEqual({ values: [], sampled: false, stats: {} });
	});
});
