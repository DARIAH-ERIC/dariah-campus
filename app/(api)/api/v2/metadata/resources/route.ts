import { createRouteHandler, toOpenApiSchema } from "@acdh-oeaw/openapi-nextjs";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import _resources from "#/public/metadata/resources.json";
import _sources from "#/public/metadata/sources.json";
import _tags from "#/public/metadata/tags.json";
import { resourceMetadataSchema, sourceMetadataSchema, tagMetadataSchema } from "#/scripts/api/metadata-schemas.ts";

const sources = v.parse(v.array(sourceMetadataSchema), _sources);
const tags = v.parse(v.array(tagMetadataSchema), _tags);

const searchParamsSchema = v.object({
	limit: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.minValue(1),
			v.maxValue(100),
			v.description("Maximum number of items to return."),
		),
		"10",
	),
	offset: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.minValue(0),
			v.description("Number of items to skip before starting to collect the result set."),
		),
		"0",
	),
	kind: v.nullish(
		v.pipe(
			v.array(v.picklist(["event", "external", "hosted", "pathfinder"])),
			v.description("Filter by resource kinds."),
		),
		[],
	),
	source: v.nullish(
		v.pipe(
			v.array(v.picklist(sources.map((item) => item.id))),
			v.description("Filter by source ids. Matches items with any of the given sources."),
		),
		[],
	),
	topic: v.nullish(
		v.pipe(
			v.array(v.picklist(tags.map((item) => item.id))),
			v.description("Filter by topic ids. Matches items with any of the given topics."),
		),
		[],
	),
	"publication-year": v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.integer(),
			v.minValue(0),
			v.description("Filter by publication year."),
		),
	),
});

const itemsSchema = v.array(resourceMetadataSchema);

const responseSchema = v.object({
	total: v.pipe(v.number(), v.integer(), v.minValue(0)),
	limit: v.pipe(v.number(), v.integer(), v.minValue(0)),
	offset: v.pipe(v.number(), v.integer(), v.minValue(0)),
	items: itemsSchema,
});

const resources = v.parse(itemsSchema, _resources);

export const GET = createRouteHandler(
	toOpenApiSchema({
		description: "Retrieves a paginated list of resources.",
		searchParams: searchParamsSchema,
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: responseSchema,
					},
				},
			},
		},
	}),
	async (request: NextRequest, _context: RouteContext<"/api/v2/metadata/resources">) => {
		const url = new URL(request.url);

		try {
			const searchParams = await v.parseAsync(searchParamsSchema, {
				limit: url.searchParams.get("limit"),
				offset: url.searchParams.get("offset"),
				kind: url.searchParams.getAll("kind"),
				"publication-year": url.searchParams.get("publication-year"),
				source: url.searchParams.getAll("source"),
				topic: url.searchParams.getAll("topic"),
			});

			const _items =
				searchParams.kind.length === 0
					? resources
					: resources.filter((resource) => searchParams.kind.includes(resource.kind));

			const items = _items.filter((item) => {
				if (
					searchParams["publication-year"] != null &&
					new Date(item["publication-date"]).getUTCFullYear() !== searchParams["publication-year"]
				) {
					return false;
				}

				if (searchParams.source.length > 0 && !item.sources.some((source) => searchParams.source.includes(source.id))) {
					return false;
				}

				if (searchParams.topic.length > 0 && !item.tags.some((tag) => searchParams.topic.includes(tag.id))) {
					return false;
				}

				return true;
			});

			const { limit, offset } = searchParams;
			const total = items.length;
			const page = items.slice(offset, offset + limit);

			const data = await v.parseAsync(responseSchema, { total, limit, offset, items: page });

			return NextResponse.json(data);
		} catch (error) {
			if (v.isValiError(error)) {
				return NextResponse.json({ message: "Invalid input" }, { status: 400 });
			}

			return NextResponse.json({ message: "Internal server error" }, { status: 500 });
		}
	},
);
