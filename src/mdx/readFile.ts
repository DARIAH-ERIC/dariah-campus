import { promises as fs } from "node:fs";

import { VFile } from "vfile";

import { type FilePath } from "@/utils/ts/aliases";

/**
 * Read file into `VFile`.
 */
export async function readFile(filePath: FilePath): Promise<VFile> {
	const file = new VFile({
		value: await fs.readFile(filePath, { encoding: "utf-8" }),
		path: filePath,
	});

	return file;
}
