import "server-only";

import { createReadStream } from "node:fs";
import { join } from "node:path";
import { ReadableStream } from "node:stream/web";

import { assert } from "@acdh-oeaw/lib";
import { imageDimensionsFromStream } from "image-dimensions";

const publicFolder = join(process.cwd(), "public");

export async function getImageDimensions(
	src: string,
): Promise<{ height: number; width: number } | null> {
	if (URL.canParse(src)) {
		const response = await fetch(src);

		if (!response.ok || response.body == null) return null;

		const contentType = response.headers.get("content-type");

		if (!contentType?.startsWith("image/")) return null;

		const dimensions =
			contentType === "image/svg+xml"
				? await getSvgDimensions(response.body as ReadableStream<Uint8Array>)
				: await imageDimensionsFromStream(response.body);

		return dimensions ?? null;
	}

	assert(src.startsWith("/"), "Images with relative paths are not supported.");

	const stream = ReadableStream.from(createReadStream(join(publicFolder, src)));

	const dimensions = src.endsWith(".svg")
		? await getSvgDimensions(stream as ReadableStream<Uint8Array>)
		: // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
			await imageDimensionsFromStream(stream as any);

	return dimensions ?? null;
}

const widthRegex = /<svg[^>]*\swidth=['"](\d+)['"]/i;
const heightRegex = /<svg[^>]*\sheight=['"](\d+)['"]/i;
const viewBoxRegex = /<svg[^>]*\sviewBox=['"](\d+) (\d+) (\d+) (\d+)['"]/i;

async function getSvgDimensions(stream: ReadableStream<Uint8Array>) {
	const chunks = [];
	const decoder = new TextDecoder();

	for await (const chunk of stream) {
		chunks.push(...chunk);
		const text = decoder.decode(new Uint8Array(chunks));

		const widthMatch = widthRegex.exec(text);
		const heightMatch = heightRegex.exec(text);

		if (widthMatch && heightMatch) {
			return {
				width: Number.parseFloat(widthMatch[1]!),
				height: Number.parseFloat(heightMatch[1]!),
			};
		}

		const viewBoxMatch = viewBoxRegex.exec(text);

		if (viewBoxMatch) {
			return {
				width: Number.parseFloat(viewBoxMatch[3]!) - Number.parseFloat(viewBoxMatch[1]!),
				height: Number.parseFloat(viewBoxMatch[4]!) - Number.parseFloat(viewBoxMatch[2]!),
			};
		}
	}

	return null;
}
