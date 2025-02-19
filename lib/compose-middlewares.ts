import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";

export type Middleware = (
	request: NextRequest,
	response: NextResponse,
	event: NextFetchEvent,
) => NextResponse | Promise<NextResponse>;

export function composeMiddleware(...middlewares: Array<Middleware>) {
	return async (request: NextRequest, event: NextFetchEvent) => {
		let response = NextResponse.next();

		for (const middleware of middlewares) {
			response = await middleware(request, response, event);

			if (response.status >= 300 || response.headers.has("x-middleware-rewrite")) {
				return response;
			}
		}

		return response;
	};
}
