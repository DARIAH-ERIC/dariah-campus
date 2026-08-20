import { describe, expect, it } from "vitest";

import { createSearchUrl } from "#/lib/navigation/create-search-url.ts";

describe("createSearchUrl", () => {
	it("links to the unfiltered search page when nothing is passed", () => {
		expect(createSearchUrl({})).toBe("/search");
	});

	/**
	 * Every person and topic name on the site links here. Indexed keys, `?people[0]=`, are not what the search page
	 * parses, so building them left all of those links landing on an unfiltered page.
	 */
	it("repeats the key per value instead of indexing it", () => {
		expect(createSearchUrl({ people: ["schreibman-susan"] })).toBe("/search?people=schreibman-susan");
		expect(createSearchUrl({ tags: ["a", "b"] })).toBe("/search?tags=a&tags=b");
	});

	it("combines people and tags", () => {
		expect(createSearchUrl({ people: ["p"], tags: ["t"] })).toBe("/search?people=p&tags=t");
	});
});
