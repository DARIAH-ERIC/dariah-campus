import { type NextRequest, NextResponse } from "next/server";
import { getLocale } from "next-intl/server";

import { createFeed } from "@/lib/create-feed";

export const dynamic = "force-static";

export async function GET(_request: NextRequest): Promise<NextResponse> {
	const locale = await getLocale();

	const feed = await createFeed(locale);

	return new NextResponse(feed, { headers: { "content-type": "application/xml" } });
}
