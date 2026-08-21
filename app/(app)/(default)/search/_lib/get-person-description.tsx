"use server";

import type { ReactNode } from "react";

import { client } from "#/lib/content/client";

/**
 * Biographies are only fetched for the people actually refined by, because sending all of them - a good 130kb - with
 * the page would cost every visitor for something almost none of them open. The compiled mdx is rendered here rather
 * than sent as text, so that its links and emphasis survive.
 */
export async function getPersonDescription(id: string): Promise<ReactNode> {
	const person = await client.collections.people.get(id);

	if (person == null || person.metadata.description.trim() === "") {
		return null;
	}

	const Content = person.content;

	return <Content />;
}
