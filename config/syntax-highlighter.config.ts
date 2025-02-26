import type { RehypeShikiOptions } from "@shikijs/rehype";

export const config: RehypeShikiOptions = {
	defaultColor: "light",
	defaultLanguage: "text",
	/** Languages are lazy-loaded on demand. */
	langs: [],
	lazy: true,
	themes: {
		light: "github-light",
	},
};
