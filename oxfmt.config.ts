import { defineConfig } from "oxfmt";

import base from "#/configs/oxfmt/base.ts";

const config = defineConfig({
	...base,
	ignorePatterns: ["pnpm-workspace.yaml", "content/", "e2e/snapshots/", "messages/*.json", "public/"],
});

export default config;
