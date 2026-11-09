import { createReader as createLocalReader } from "@keystatic/core/reader";

import { config } from "#/lib/content/keystatic/config.ts";

export const reader = createLocalReader(process.cwd(), config);
