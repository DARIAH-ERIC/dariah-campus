/**
 * Returns union of object values.
 *
 * Useful when using plaing objects to substitute for `const enum`, which
 * are not supported by babel.
 */
export type Values<T> = {
	[K in keyof T]: T[K];
}[keyof T];
