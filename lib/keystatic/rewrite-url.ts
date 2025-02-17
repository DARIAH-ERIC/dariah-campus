import { isNonEmptyString } from "@acdh-oeaw/lib";

/**
 * @see https://github.com/Thinkmill/keystatic/issues/978#issuecomment-2005730530
 * @see https://github.com/Thinkmill/keystatic/issues/1022
 */
export function rewriteUrl(request: Request): Request {
	const forwardedHost = request.headers.get("x-forwarded-host");
	const forwardedProto = request.headers.get("x-forwarded-proto");
	const forwardedPort = request.headers.get("x-forwarded-port");

	if (isNonEmptyString(forwardedHost) && isNonEmptyString(forwardedProto)) {
		const url = new URL(request.url);

		url.hostname = forwardedHost;
		url.protocol = forwardedProto;
		url.port = forwardedPort ?? "";

		return new Request(url, request);
	}

	return request;
}
