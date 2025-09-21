import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import curricula from "@/public/metadata/curricula.json";

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

		const { limit, offset } = filters;
		const total = curricula.length;
		const page = curricula.slice(offset, offset + limit);

		return NextResponse.json({ total, limit, offset, items: page });
	} catch (error) {
		if (v.isValiError(error)) {
			return NextResponse.json({ message: "Invalid input" }, { status: 400 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
