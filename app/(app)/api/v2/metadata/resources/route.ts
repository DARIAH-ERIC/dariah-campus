import { keyByToMap } from "@acdh-oeaw/lib";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import { defaultLocale as locale } from "@/config/i18n.config";
import { createClient } from "@/lib/content/create-client";
import { ensureArray } from "@/lib/ensure-array";

const SearchFiltersSchema = v.object({
	limit: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.integer(),
			v.minValue(1),
			v.maxValue(100),
		),
		"100",
	),
	offset: v.nullish(
		v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(0)),
		"0",
	),
	kind: v.nullish(
		v.pipe(
			v.unknown(),
			v.transform(ensureArray),
			v.array(v.picklist(["event", "external", "hosted", "pathfinder"])),
		),
		[],
	),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
	const searchParams = new URL(request.url).searchParams;

	try {
		const filters = await v.parseAsync(SearchFiltersSchema, {
			limit: searchParams.get("limit"),
			offset: searchParams.get("offset"),
			kind: searchParams.getAll("kind"),
		});

		const client = await createClient(locale);

		const peopleById = keyByToMap(await client.people.all(), (person) => {
			return person.id;
		});

		const tagsById = keyByToMap(await client.tags.all(), (tag) => {
			return tag.id;
		});

		const sourcesById = keyByToMap(await client.sources.all(), (source) => {
			return source.id;
		});

		const items =
			filters.kind.length === 0
				? await client.resources.all()
				: (
						await Promise.all(
							filters.kind.map((kind) => {
								switch (kind) {
									case "event": {
										return client.resources.events.all();
									}
									case "external": {
										return client.resources.external.all();
									}
									case "hosted": {
										return client.resources.hosted.all();
									}
									case "pathfinder": {
										return client.resources.pathfinders.all();
									}
								}
							}),
						)
					).flat();

		const { limit, offset } = filters;
		const total = items.length;

		const page = items.slice(offset, offset + limit).map((item) => {
			return {
				...item,
				data: {
					...item.data,
					authors: item.data.authors.map((id) => {
						return peopleById.get(id);
					}),
					editors:
						"editors" in item.data
							? item.data.editors.map((id) => {
									return peopleById.get(id);
								})
							: [],
					contributors:
						"contributors" in item.data
							? item.data.contributors.map((id) => {
									return peopleById.get(id);
								})
							: [],
					tags: item.data.tags.map((id) => {
						return tagsById.get(id);
					}),
					sources: item.data.sources.map((id) => {
						return sourcesById.get(id);
					}),
				},
			};
		});

		return NextResponse.json({ total, limit, offset, items: page });
	} catch (error) {
		if (v.isValiError(error)) {
			return NextResponse.json({ message: "Invalid input" }, { status: 400 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
