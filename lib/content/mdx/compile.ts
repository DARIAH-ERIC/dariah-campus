import { log } from "@acdh-oeaw/lib";
import { type ProcessorOptions, compile as compileMdx } from "@mdx-js/mdx";
import type { VFile } from "vfile";

export type CompileOptions = Pick<
	ProcessorOptions,
	"baseUrl" | "recmaPlugins" | "rehypePlugins" | "remarkPlugins" | "remarkRehypeOptions"
>;

export async function compile(input: VFile, options: CompileOptions): Promise<VFile> {
	const output = await compileMdx(input, {
		...options,
		format: "mdx",
		jsx: true,
		providerImportSource: "#/lib/content/mdx/components",
	});

	/** Plugins report authoring mistakes as messages, which are otherwise swallowed by the content build. */
	output.messages.forEach((message) => {
		log.warn(`${message.file ?? input.path}: ${message.reason}`);
	});

	return output;
}
