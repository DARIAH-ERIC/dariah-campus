import { err, ok, type Result, wait } from "@acdh-oeaw/lib";
import isNetworkError from "is-network-error";

type ResponseType =
	| "arrayBuffer"
	| "blob"
	| "formData"
	| "json"
	| "raw"
	| "stream"
	| "text"
	| "void";

interface GetReturnType {
	arrayBuffer: ArrayBuffer;
	blob: Blob;
	formData: FormData;
	json: unknown;
	raw: Response;
	stream: ReadableStream<Uint8Array>;
	text: string;
	void: null;
}

type HttpMethod = "delete" | "get" | "head" | "options" | "patch" | "post" | "put" | "trace";

export interface RequestOptions<TResponseType extends ResponseType> extends RequestInit {
	method?: HttpMethod;
	responseType: TResponseType;
	/**
	 * @default 0
	 */
	retries?: number;
	/**
	 * Timeout in milliseconds.
	 *
	 * @default 10_000
	 */
	timeout?: number;
}

export async function request<TResponseType extends ResponseType>(
	url: URL,
	options: RequestOptions<TResponseType>,
): Promise<
	Result<GetReturnType[TResponseType], AbortError | HttpError | NetworkError | TimeoutError>
> {
	const {
		headers: _headers,
		method: _method,
		responseType,
		retries = 0,
		signal: _signal,
		timeout = 10_000,
		...fetchOptions
	} = options;

	const method = _method != null ? _method.toUpperCase() : "GET";

	const headers = new Headers(_headers);

	if (!headers.has("accept")) {
		if (responseType === "json") {
			headers.set("accept", "application/json");
		} else if (responseType === "text") {
			headers.set("accept", "text/plain");
		} else {
			headers.set("accept", "*/*");
		}
	}

	if (
		options.body != null &&
		typeof options.body !== "string" &&
		!(options.body instanceof FormData)
	) {
		options.body = JSON.stringify(options.body);
		if (!headers.has("content-type")) {
			headers.set("content-type", "application/json");
		}
	}

	let attempts = 0;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		const timeoutSignal = AbortSignal.timeout(timeout);

		const signal = _signal ? AbortSignal.any([_signal, timeoutSignal]) : timeoutSignal;

		const request = new Request(url, { ...fetchOptions, headers, method, signal });

		try {
			const response = await fetch(request);

			if (!response.ok) {
				throw new HttpError(request, response);
			}

			// if (responseType === "content-type") {
			//     const contentType = getContentType(response);
			//     // TODO:
			// }

			if (responseType === "raw") {
				return ok(response as GetReturnType[TResponseType]);
			}

			if (responseType === "stream") {
				return ok(response.body as GetReturnType[TResponseType]);
			}

			if (responseType === "void") {
				await response.body?.cancel();
				return ok(null as GetReturnType[TResponseType]);
			}

			if (
				responseType === "json" &&
				(response.status === 204 || response.headers.get("content-length") === "0")
			) {
				await response.body?.cancel();
				return ok("" as GetReturnType[TResponseType]);
			}

			return ok(
				(await response[
					responseType as Exclude<TResponseType, "json" | "raw" | "stream" | "void">
				]()) as GetReturnType[TResponseType],
			);
		} catch (error: unknown) {
			attempts += 1;

			if (error instanceof Error) {
				/** error instanceof DOMException */
				if (error.name === "AbortError") {
					return err(new AbortError(request, error));
				}

				/** error instanceof DOMException */
				if (error.name === "TimeoutError") {
					return err(new TimeoutError(request, error));
				}

				if (error instanceof HttpError) {
					if (
						attempts < retries + 1 &&
						[
							408, 413, 429, 500, 502, 503, 504,
							/** The following are cloudflare-specific status codes. */ 521, 522, 524,
						].includes(error.response.status) &&
						/**
						 * In rest apis, only `patch` and `post` are not idempotent.
						 * However, in rpc apis, `delete` and `put` may have side-effects as well.
						 */
						[
							// "delete",
							"get",
							"head",
							"options",
							// "patch",
							// "post",
							// "put",
							"trace",
						].includes(error.request.method)
					) {
						const retryAfter = getRetryAfterDelay(error.response);

						if (retryAfter != null && retryAfter > timeout) {
							return err(error);
						}

						if (retryAfter == null && error.response.status === 413) {
							return err(error);
						}

						await wait(retryAfter ?? backoff(attempts), _signal ?? undefined);
						continue;
					}

					return err(error);
				}

				if (isNetworkError(error)) {
					if (attempts < retries + 1) {
						await wait(backoff(attempts), _signal ?? undefined);
						continue;
					}

					return err(new NetworkError(request, error));
				}
			}

			throw error;
		}
	}
}

export class HttpError extends Error {
	private static readonly type = "HttpError";
	request: Request;
	response: Response;

	static is(error: unknown): error is HttpError {
		if (error instanceof HttpError) {
			return true;
		}

		return error instanceof Error && error.name === HttpError.type;
	}

	constructor(
		request: Request,
		response: Response,
		message = `${response.statusText} (${String(response.status)}) for ${request.method} ${request.url}`,
	) {
		super(message);

		this.name = HttpError.type;
		this.request = request;
		this.response = response;
	}
}

export class AbortError extends Error {
	private static readonly type = "AbortError";
	request: Request;

	static is(error: unknown): error is AbortError {
		if (error instanceof AbortError) {
			return true;
		}

		return error instanceof Error && error.name === AbortError.type;
	}

	constructor(
		request: Request,
		cause: Error,
		message = `Request aborted for ${request.method} ${request.url}`,
	) {
		super(message, { cause });

		this.name = AbortError.type;
		this.request = request;
	}
}

export class TimeoutError extends Error {
	private static readonly type = "TimeoutError";
	request: Request;

	static is(error: unknown): error is TimeoutError {
		if (error instanceof TimeoutError) {
			return true;
		}

		return error instanceof Error && error.name === TimeoutError.type;
	}

	constructor(
		request: Request,
		cause: Error,
		message = `Request timed out for ${request.method} ${request.url}`,
	) {
		super(message, { cause });

		this.name = TimeoutError.type;
		this.request = request;
	}
}

export class NetworkError extends Error {
	private static readonly type = "NetworkError";
	request: Request;

	static is(error: unknown): error is NetworkError {
		if (error instanceof NetworkError) {
			return true;
		}

		return error instanceof Error && error.name === NetworkError.type;
	}

	constructor(
		request: Request,
		cause: Error,
		message = `Network error for ${request.method} ${request.url}`,
	) {
		super(message, { cause });

		this.name = NetworkError.type;
		this.request = request;
	}
}

function backoff(attempts: number): number {
	return 1_000 * Math.pow(2, attempts - 1) * 0.3;
}

function getRetryAfterDelay(response: Response): number | null {
	const retryAfter = response.headers.get("retry-after");

	if (retryAfter == null) {
		return null;
	}

	if (![413, 429, 503].includes(response.status)) {
		return null;
	}

	/** The `retry-after` header can be specified as a date, or in seconds. */
	const time = Number(retryAfter);

	if (!Number.isNaN(time)) {
		return 1_000 * time;
	}

	const timestamp = new Date(time).getTime();

	if (!Number.isNaN(timestamp)) {
		return timestamp - Date.now();
	}

	return null;
}

// function getContentType(response: Response): string | null {
// 	const contentTypeHeader = response.headers.get("content-type");
// 	return contentTypeHeader?.split(";").at(0)?.trim() ?? null;
// }

/**
 * Polyfills.
 *
 * @see https://caniuse.com/mdn-api_abortsignal_any_static
 * @see https://caniuse.com/mdn-api_abortsignal_timeout_static
 */

if (!Object.prototype.hasOwnProperty.call(AbortSignal, "timeout")) {
	AbortSignal.timeout = function timeout(ms: number): AbortSignal {
		const controller = new AbortController();

		setTimeout(() => {
			controller.abort(new DOMException("TimeoutError", "TimeoutError"));
		}, ms);

		return controller.signal;
	};
}

if (!Object.prototype.hasOwnProperty.call(AbortSignal, "any")) {
	AbortSignal.any = function any(signals: Array<AbortSignal>): AbortSignal {
		const controller = new AbortController();

		function onAbort(this: AbortSignal) {
			controller.abort(this.reason);
			cleanup();
		}

		function cleanup() {
			for (const signal of signals) {
				signal.removeEventListener("abort", onAbort);
			}
		}

		for (const signal of signals) {
			if (signal.aborted) {
				controller.abort(signal.reason);
				cleanup();
				break;
			}

			signal.addEventListener("abort", onAbort, { once: true });
		}

		return controller.signal;
	};
}
