import { TaggedError } from "better-result";

export class AbortError extends TaggedError("AbortError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
}> {}

export class ParseError extends TaggedError("ParseError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
	readonly response: Response;
}> {}

export class HttpError extends TaggedError("HttpError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
	readonly response: Response;
}> {}

export class NetworkError extends TaggedError("NetworkError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
}> {}

export class TimeoutError extends TaggedError("TimeoutError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
}> {}

export type RequestError = AbortError | ParseError | HttpError | NetworkError | TimeoutError;
