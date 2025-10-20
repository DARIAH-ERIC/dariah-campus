import { createRouteHandler, toOpenApiSchema } from "@acdh-oeaw/openapi-nextjs";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import _resources from "@/public/metadata/resources.json";
import { resourceMetadataSchema } from "@/scripts/api/generate-metadata-dump";

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
			});

			const _items =
				searchParams.kind.length === 0
					? resources
					: resources.filter((resource) => {
							return searchParams.kind.includes(resource.kind);
						});

			const items =
				searchParams["publication-year"] != null
					? _items.filter((item) => {
							return (
								new Date(item["publication-date"]).getUTCFullYear() ===
								searchParams["publication-year"]
							);
						})
					: _items;

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
