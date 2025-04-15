import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import { ensureArray } from "@/lib/ensure-array";
import resources from "@/public/metadata/resources.json";

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

		const collections = filters.kind.map((kind) => {
			return `resources-${kind}`;
		});

		const items =
			collections.length === 0
				? resources
				: resources.filter((item) => {
						return collections.includes(item.collection);
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
