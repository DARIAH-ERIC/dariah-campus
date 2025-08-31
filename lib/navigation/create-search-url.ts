import { createHref } from "@/lib/navigation/create-href";

export function createSearchUrl({
	people = [],
	tags = [],
}: {
	people?: Array<string>;
	tags?: Array<string>;
}): string {
	const searchParams = new URLSearchParams();

	people.forEach((person, index) => {
		searchParams.set(`people[${String(index)}]`, person);
	});

	tags.forEach((tag, index) => {
		searchParams.set(`tags[${String(index)}]`, tag);
	});

	return createHref({ pathname: "/search", searchParams });
}
