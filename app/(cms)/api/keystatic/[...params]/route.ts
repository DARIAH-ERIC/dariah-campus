import { makeRouteHandler } from "@keystatic/next/route-handler";

import { config } from "@/lib/content/keystatic/config";
import { rewriteUrl } from "@/lib/content/keystatic/utils/rewrite-url";

const { GET: _GET, POST: _POST } = makeRouteHandler({ config });

export function GET(request: Request): Promise<Response> {
	return _GET(rewriteUrl(request));
}

export function POST(request: Request): Promise<Response> {
	return _POST(rewriteUrl(request));
}
