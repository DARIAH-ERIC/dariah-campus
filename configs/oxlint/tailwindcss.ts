import { defineConfig } from "oxlint";

const config = defineConfig({
	jsPlugins: [{ name: "better-tailwindcss", specifier: "eslint-plugin-better-tailwindcss" }],
	rules: {
		/**
		 * ================================================================================================================
		 * Correctness.
		 * ================================================================================================================
		 */

		"better-tailwindcss/no-unknown-classes": "error",
		"better-tailwindcss/no-conflicting-classes": "error",
		"better-tailwindcss/no-restricted-classes": "error",

		/**
		 * ================================================================================================================
		 * Style.
		 * ================================================================================================================
		 */

		"better-tailwindcss/enforce-canonical-classes": "error",
		"better-tailwindcss/enforce-consistent-class-order": ["error", { order: "strict" }],
		"better-tailwindcss/enforce-consistent-important-position": "off",
		"better-tailwindcss/enforce-consistent-line-wrapping": "off",
		"better-tailwindcss/enforce-consistent-variable-syntax": "error",
		"better-tailwindcss/enforce-consistent-variant-order": "error",
		"better-tailwindcss/enforce-logical-properties": "error",
		"better-tailwindcss/enforce-shorthand-classes": "off",
		"better-tailwindcss/no-deprecated-classes": "error",
		"better-tailwindcss/no-duplicate-classes": "error",
		"better-tailwindcss/no-unnecessary-whitespace": "error",
	},
	settings: {
		"better-tailwindcss": {
			selectors: [
				{
					kind: "callee",
					name: "^cn$",
					match: [{ type: "strings" }, { type: "objectValues" }],
				},
				{
					kind: "callee",
					name: "^styles$",
					match: [
						{ type: "strings" },
						{ type: "objectValues", path: "^base$" },
						{ type: "objectValues", path: "^variants.*$" },
						{ type: "objectValues", path: "^combinations\\[\\d+\\]\\[1\\]$" },
					],
				},
			],
		},
		react: {
			formComponents: ["Form"],
			linkComponents: ["Link", "NavLink"],
		},
	},
});

export default config;
