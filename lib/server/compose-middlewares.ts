import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";

export type Middleware = (
	request: NextRequest,
	response: NextResponse,
	event: NextFetchEvent,
) => NextResponse | Promise<NextResponse>;

export function composeMiddleware(...middlewares: Array<Middleware>) {
	return async (request: NextRequest, event: NextFetchEvent): Promise<NextResponse> => {
		const response = NextResponse.next();

		for (const middleware of middlewares) {
			/**
			 * Middleware functions should mutate and return the shared `response` object, or
			 * short-circuit the middleware stack by returning `NextResponse.redirect()`,
			 * `NextResponse.rewrite()` or `new NextResponse()`.
			 */
			const middleWareResponse = await middleware(request, response, event);

			if (middleWareResponse !== response) {
				return middleWareResponse;
			}
		}

		return response;
	};
}
