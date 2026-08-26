import * as path from "node:path";

import { defineConfig } from "oxlint";

import base from "#/configs/oxlint/base.ts";
import nextjs from "#/configs/oxlint/nextjs.ts";
import playwright from "#/configs/oxlint/playwright.ts";
import react from "#/configs/oxlint/react.ts";
import regexp from "#/configs/oxlint/regexp.ts";
import tailwindcss from "#/configs/oxlint/tailwindcss.ts";

const baseRestrictedImports = {
	paths: [
		{
			message: "Please use `next/navigation` instead.",
			name: "next/router",
		},
	],
	patterns: [{ group: ["./**", "../**"] }],
};

const config = defineConfig({
	extends: [base, nextjs, playwright, react, regexp, tailwindcss],
	ignorePatterns: ["**/*.d.ts"],
	options: {
		reportUnusedDisableDirectives: "error",
		typeAware: true,
		typeCheck: true,
	},
	rules: {
		"no-redeclare": "off",
		"no-restricted-imports": ["error", baseRestrictedImports],
	},
	settings: {
		"better-tailwindcss": {
			cwd: import.meta.dirname,
			entryPoint: path.join(import.meta.dirname, "./styles/index.css"),
		},
	},
	overrides: [
		{
			files: ["configs/**/*.ts", "vitest.config.ts"],
			rules: {
				"import/no-default-export": "off",
			},
		},
	],
});

export default config;
