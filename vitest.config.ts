import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"#/": `${import.meta.dirname}/`,
		},
	},
	test: {
		env: {
			/** The modules under test import the env config, which is not what these tests are about. */
			ENV_VALIDATION: "disabled",
			/** Url helpers resolve against this, and return a relative href when the origin matches. */
			NEXT_PUBLIC_APP_BASE_URL: "https://dariah-campus.test",
		},
		exclude: ["**/node_modules/**", "**/.content/**", "e2e/**"],
		include: ["**/*.test.ts"],
	},
});
