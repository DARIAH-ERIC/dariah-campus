import { type NextRequest, NextResponse } from "next/server";

import { createFeed } from "@/lib/rss/create-feed";

export const dynamic = "force-static";

export async function GET(_request: NextRequest): Promise<NextResponse> {
	const feed = await createFeed();

	return new NextResponse(feed, { headers: { "content-type": "application/xml" } });
}
