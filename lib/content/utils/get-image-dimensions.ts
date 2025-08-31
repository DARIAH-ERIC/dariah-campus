import "server-nodejs-only";

import { join } from "node:path";

import { assert } from "@acdh-oeaw/lib";
import { imageSizeFromFile } from "image-size/fromFile";

const publicFolder = join(process.cwd(), "public");

/**
 * Be aware that vercel's output file tracing will include the whole public folder when
 * this function is called in a server component. Consider excluding public assets via
 * `outputFileTracingExcludes` and adding `force-static` route configs.
 *
 * Preferably, use this function in a node.js script only.
 */
export async function getImageDimensions(
	src: string,
): Promise<{ src: string; height: number; width: number } | string> {
	assert(src.startsWith("/"), "Only images in the public folder are supported.");

	const absoluteFilePath = join(publicFolder, src);
	const dimensions = await imageSizeFromFile(absoluteFilePath);

	return { ...dimensions, src };
}
