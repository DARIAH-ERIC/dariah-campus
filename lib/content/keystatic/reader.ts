import { createReader as createLocalReader } from "@keystatic/core/reader";

import { config } from "@/lib/content/keystatic/config";

export const reader = createLocalReader(process.cwd(), config);
