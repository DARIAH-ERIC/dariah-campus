import { NextResponse } from "next/server";

import type { Middleware } from "@/lib/server/compose-middlewares";

/**
 * While next.js provides built-in csrf protection for server actions, regular route handlers are
 * not protected.
 */
export const middleware: Middleware = function middleware(request, response) {
	if (request.method !== "GET") {
		const originHeader = request.headers.get("origin");
		const hostHeader = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

		if (originHeader == null || hostHeader == null) {
			return new NextResponse(null, { status: 403 });
		}

		const origin = URL.parse(originHeader);

		if (origin == null || origin.host !== hostHeader) {
			return new NextResponse(null, { status: 403 });
		}
	}

	return response;
};
