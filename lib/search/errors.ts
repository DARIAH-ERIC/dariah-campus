import { TaggedError } from "better-result";

export class SearchConnectionError extends TaggedError("SearchConnectionError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}

export class SearchError extends TaggedError("SearchError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}

export class SearchCollectionError extends TaggedError("SearchCollectionError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}

export class SearchApiKeyError extends TaggedError("SearchApiKeyError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}

export class SearchImportError extends TaggedError("SearchImportError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}

export class SearchDocumentUpsertError extends TaggedError("SearchDocumentUpsertError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}

export class SearchDocumentDeleteError extends TaggedError("SearchDocumentDeleteError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}
