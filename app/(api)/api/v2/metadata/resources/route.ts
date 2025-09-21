import { ensureArray } from "@acdh-oeaw/lib";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import resources from "@/public/metadata/resources.json";

const searchFiltersSchema = v.object({
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
	kind: v.nullish(v.pipe(v.array(v.picklist(["event", "external", "hosted", "pathfinder"]))), []),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SearchFiltersSchema = v.InferInput<typeof searchFiltersSchema>;

export async function GET(request: NextRequest): Promise<NextResponse> {
	const searchParams = new URL(request.url).searchParams;

	try {
		const filters = await v.parseAsync(searchFiltersSchema, {
			limit: searchParams.get("limit"),
			offset: searchParams.get("offset"),
			kind: searchParams.getAll("kind"),
		});

		const items =
			filters.kind.length === 0
				? resources
				: resources.filter((resource) => {
						return filters.kind.includes(resource.kind);
					});

		const { limit, offset } = filters;
		const total = items.length;

		const page = items.slice(offset, offset + limit);

		return NextResponse.json({ total, limit, offset, items: page });
	} catch (error) {
		if (v.isValiError(error)) {
			return NextResponse.json({ message: "Invalid input" }, { status: 400 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
