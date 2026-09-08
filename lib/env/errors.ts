import { TaggedError } from "better-result";

export class ValidationError extends TaggedError("ValidationError")<{
	readonly cause?: unknown;
	readonly message?: string;
}> {}
