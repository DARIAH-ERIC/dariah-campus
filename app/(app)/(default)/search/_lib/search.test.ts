import { describe, expect, it } from "vitest";

import {
	createSearchParameters,
	createSearchState,
	createSearchStateFromUrl,
	emptyFilters,
} from "#/app/(app)/(default)/search/_lib/search.ts";

describe("createSearchState", () => {
	it("defaults to an empty query and no refinements", () => {
		expect(createSearchState({})).toEqual({ query: "", filters: emptyFilters });
	});

	it("reads a single value provided as a bare string", () => {
		const state = createSearchState({ q: "digital", tags: "a" });

		expect(state.query).toBe("digital");
		expect(state.filters.tags).toEqual(["a"]);
	});

	/** Repeated keys, `?tags=a&tags=b`, are the format the whole app builds and parses. */
	it("reads repeated keys as multiple values", () => {
		expect(createSearchState({ tags: ["a", "b"] }).filters.tags).toEqual(["a", "b"]);
	});

	it("ignores parameters which are not facet attributes", () => {
		expect(createSearchState({ unrelated: "x" })).toEqual({ query: "", filters: emptyFilters });
	});

	it("trims values and drops empty ones", () => {
		expect(createSearchState({ tags: [" a ", "", "   "] }).filters.tags).toEqual(["a"]);
	});

	it("deduplicates repeated values", () => {
		expect(createSearchState({ tags: ["a", "a", "b"] }).filters.tags).toEqual(["a", "b"]);
	});

	it("keeps only the first query parameter", () => {
		expect(createSearchState({ q: ["one", "two"] }).query).toBe("one");
	});
});

describe("createSearchStateFromUrl", () => {
	it("reads every value of a repeated key", () => {
		const state = createSearchStateFromUrl(new URLSearchParams("q=digital&tags=a&tags=b&locale=en"));

		expect(state.query).toBe("digital");
		expect(state.filters.tags).toEqual(["a", "b"]);
		expect(state.filters.locale).toEqual(["en"]);
	});

	/**
	 * Refinements travel as repeated keys. An indexed or bracketed key parses as a parameter of that literal name, so
	 * anything building `?tags[0]=a` silently produces an unfiltered search rather than an error.
	 */
	it("does not recognise indexed or bracketed keys", () => {
		expect(createSearchStateFromUrl(new URLSearchParams("tags[0]=a")).filters.tags).toEqual([]);
		expect(createSearchStateFromUrl(new URLSearchParams("tags[]=a")).filters.tags).toEqual([]);
	});
});

describe("createSearchParameters", () => {
	it("omits an empty query and empty refinements", () => {
		expect(createSearchParameters({ query: "  ", filters: emptyFilters }).toString()).toBe("");
	});

	it("appends one entry per value rather than indexing them", () => {
		const searchParams = createSearchParameters({
			query: "digital",
			filters: { ...emptyFilters, tags: ["a", "b"] },
		});

		expect(searchParams.toString()).toBe("q=digital&tags=a&tags=b");
		expect(searchParams.getAll("tags")).toEqual(["a", "b"]);
	});

	it("trims the query", () => {
		expect(createSearchParameters({ query: "  digital  ", filters: emptyFilters }).get("q")).toBe("digital");
	});
});

describe("url round trip", () => {
	it("preserves query and refinements", () => {
		const state = createSearchState({ q: "digital", tags: ["a", "b"], people: ["p"], locale: ["en"] });
		const roundTripped = createSearchStateFromUrl(createSearchParameters(state));

		expect(roundTripped).toEqual(state);
	});

	it("preserves values containing characters which need encoding", () => {
		const state = createSearchState({ tags: ["a b", "a&b", "a=b", "a#b"] });
		const roundTripped = createSearchStateFromUrl(createSearchParameters(state));

		expect(roundTripped.filters.tags).toEqual(["a b", "a&b", "a=b", "a#b"]);
	});
});
