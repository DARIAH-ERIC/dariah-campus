import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import _resources from "@/public/metadata/legacy/resources.json";

export const dynamic = "force-static";

const { resources } = _resources;

v.optional(v.pipe(v.string(), v.transform(Number), v.integer()));
const SearchParamsInputSchema = v.object({
	limit: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.integer(),
			v.minValue(1),
			v.maxValue(250),
		),
		"100",
	),
	offset: v.nullish(
		v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(0)),
		"0",
	),
});

export function GET(request: NextRequest): NextResponse {
	const url = new URL(request.url);

	try {
		const { limit, offset } = v.parse(SearchParamsInputSchema, {
			limit: url.searchParams.get("limit"),
			offset: url.searchParams.get("offset"),
		});

		return NextResponse.json({
			offset,
			limit,
			total: resources.length,
			resources: resources.slice(offset, offset + limit),
		});
	} catch (error) {
		if (error instanceof v.ValiError) {
			return NextResponse.json({ message: "Invalid input" }, { status: 400 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
