import { defineConfig } from "oxfmt";

import base from "#/configs/oxfmt/base.ts";

const config = defineConfig({
	...base,
	/** Leading slashes anchor to the repository root, so `lib/content/` and the like stay formatted. */
	ignorePatterns: ["/pnpm-workspace.yaml", "/content/", "/e2e/snapshots/", "/messages/*.json", "/public/"],
});

export default config;
