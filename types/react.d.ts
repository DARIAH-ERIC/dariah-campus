declare module "react" {
	interface CSSProperties extends Record<`--${string}`, number | string | null> {}
}

// oxlint-disable-next-line unicorn/require-module-specifiers
export {};
