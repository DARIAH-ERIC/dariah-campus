import { makeRouteHandler } from "@keystatic/next/route-handler";

import { keystaticConfig as config, rewriteUrl } from "@/lib/content";

const { GET: _GET, POST: _POST } = makeRouteHandler({ config });

export function GET(request: Request): Promise<Response> {
	return _GET(rewriteUrl(request));
}

export function POST(request: Request): Promise<Response> {
	return _POST(rewriteUrl(request));
}
