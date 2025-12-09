/* eslint-disable no-restricted-syntax */

import { join } from "node:path";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";
import { config as dotenv } from "dotenv";
import { expand } from "dotenv-expand";
import isCI from "is-in-ci";

/**
 * Reading `.env` files here instead of using `dotenv-cli` so environment variables are
 * available to the vs code plugin as well.
 */
for (const envFilePath of [".env.test.local", ".env.local", ".env.test", ".env"]) {
	expand(dotenv({ path: join(process.cwd(), envFilePath), quiet: true }));
}

function getConfig():
	| { kind: "remote"; baseUrl: string; webServer: undefined }
	| { kind: "local"; baseUrl: string; webServer: PlaywrightTestConfig["webServer"] } {
	const remoteBaseUrl = process.env.PLAYWRIGHT_TEST_APP_BASE_URL;

	if (isNonEmptyString(remoteBaseUrl)) {
		return {
			kind: "remote",
			baseUrl: remoteBaseUrl,
			webServer: undefined,
		};
	}

	const port = Number(process.env.PORT) || 3000;
	const baseUrl = `http://localhost:${String(port)}`;

	return {
		kind: "local",
		baseUrl,
		webServer: {
			command: `pnpm run start --port ${String(port)}`,
			url: baseUrl,
			reuseExistingServer: !isCI,
		},
	};
}

const config = getConfig();

export default defineConfig({
	testDir: "../e2e",
	snapshotDir: "../e2e/snapshots",
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	maxFailures: 10,
	workers: isCI ? 1 : undefined,
	reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["html"]],
	use: {
		baseURL: config.baseUrl,
		screenshot: "on-first-failure",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"], channel: "chromium" },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
		/** Test against mobile viewports. */
		// {
		//     name: "Mobile Chrome",
		//     use: { ...devices["Pixel 5"] },
		// },
		// {
		//     name: "Mobile Safari",
		//     use: { ...devices["iPhone 12"] },
		// },
		/** Test against branded browsers. */
		// {
		//     name: "Microsoft Edge",
		//     use: { ...devices["Desktop Edge"], channel: "msedge" },
		// },
		// {
		//     name: "Google Chrome",
		//     use: { ...devices["Desktop Chrome"], channel: "chrome" },
		// },
	],
	webServer: config.webServer,
});
