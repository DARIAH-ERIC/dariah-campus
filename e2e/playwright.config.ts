import { join } from "node:path";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { config as dotenv } from "@dotenvx/dotenvx";
import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";
import isCI from "is-in-ci";

/**
 * Reading `.env` files here instead of using `dotenvx run` so environment variables are available to the vs code plugin
 * as well.
 */
dotenv({
	path: [".env.test.local", ".env.local", ".env.test", ".env"].map((filePath) =>
		join(import.meta.dirname, "..", filePath),
	),
	ignore: ["MISSING_ENV_FILE"],
	quiet: true,
});

type WebServer = Extract<NonNullable<PlaywrightTestConfig["webServer"]>, { command: string }>;

function getConfig():
	| { kind: "remote"; baseUrl: string; webServer: undefined }
	| { kind: "local"; baseUrl: string; webServer: WebServer } {
	// oxlint-disable-next-line node/no-process-env
	const remoteBaseUrl = process.env.PLAYWRIGHT_TEST_APP_BASE_URL;

	if (isNonEmptyString(remoteBaseUrl)) {
		return {
			kind: "remote",
			baseUrl: remoteBaseUrl,
			webServer: undefined,
		};
	}

	// oxlint-disable-next-line node/no-process-env
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

const webServers: Array<WebServer> = [];

if (config.webServer != null) {
	webServers.push(config.webServer);
}

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
	],
	webServer: webServers,
});
