import { createHref } from "#/lib/navigation/create-href.ts";

export function createSearchUrl({ people = [], tags = [] }: { people?: Array<string>; tags?: Array<string> }): string {
	const searchParams = new URLSearchParams();

	/** Repeated keys, matching how the search page parses its refinements. */
	people.forEach((person) => {
		searchParams.append("people", person);
	});

	tags.forEach((tag) => {
		searchParams.append("tags", tag);
	});

	return createHref({ pathname: "/search", searchParams });
}
