import { join } from "node:path";

import { defineConfig, devices } from "@playwright/test";
import { isCI } from "ci-info";
import { config as dotenv } from "dotenv";
import { expand } from "dotenv-expand";

/**
 * Reading `.env` files here instead of using `dotenv-cli` so environment variables are
 * available to the vs code plugin as well.
 */
for (const envFilePath of [".env.test.local", ".env.local", ".env.test", ".env"]) {
	expand(dotenv({ path: join(process.cwd(), envFilePath) }));
}

const port = 3000;
const baseUrl = `http://localhost:${String(port)}`;

export default defineConfig({
	testDir: "./e2e",
	snapshotDir: "./e2e/snapshots",
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	maxFailures: 10,
	workers: isCI ? 1 : undefined,
	reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["html"]],
	use: {
		baseURL: baseUrl,
		screenshot: "on-first-failure",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "setup",
			testMatch: "global.setup.ts",
		},
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"], channel: "chromium" },
			dependencies: ["setup"],
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
			dependencies: ["setup"],
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
			dependencies: ["setup"],
		},
		/** Test against mobile viewports. */
		// {
		// 	name: "Mobile Chrome",
		// 	use: { ...devices["Pixel 5"] },
		// 	dependencies: ["setup"],
		// },
		// {
		// 	name: "Mobile Safari",
		// 	use: { ...devices["iPhone 12"] },
		// 	dependencies: ["setup"],
		// },
		/** Test against branded browsers. */
		// {
		// 	name: "Microsoft Edge",
		// 	use: { ...devices["Desktop Edge"], channel: "msedge" },
		// 	dependencies: ["setup"],
		// },
		// {
		// 	name: "Google Chrome",
		// 	use: { ...devices["Desktop Chrome"], channel: "chrome" },
		// 	dependencies: ["setup"],
		// },
	],
	webServer: {
		command: "pnpm run start",
		url: baseUrl,
		reuseExistingServer: !isCI,
	},
});
