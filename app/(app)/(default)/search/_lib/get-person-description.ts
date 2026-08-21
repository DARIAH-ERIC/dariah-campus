"use server";

import { client } from "#/lib/content/client";

/**
 * Long enough to be worth reading, short enough that the popover neither scrolls nor needs its own scroll container - a
 * scrollable region inside an overlay is awkward to reach by keyboard.
 */
const maxDescriptionLength = 320;

function truncate(description: string): string {
	if (description.length <= maxDescriptionLength) {
		return description;
	}

	const truncated = description.slice(0, maxDescriptionLength);
	const lastSpace = truncated.lastIndexOf(" ");

	return `${(lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trimEnd()}…`;
}

/**
 * Biographies are only fetched for the people actually refined by, because sending all of them - a good 130kb - with
 * the page would cost every visitor for something almost none of them open.
 */
export async function getPersonDescription(id: string): Promise<string | null> {
	const person = await client.collections.people.get(id);
	const description = person?.metadata.description.trim();

	return description == null || description === "" ? null : truncate(description);
}
