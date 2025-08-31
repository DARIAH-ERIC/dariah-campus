import { compile as compileMdx, type ProcessorOptions } from "@mdx-js/mdx";
import type { VFile } from "vfile";

export type CompileOptions = Pick<
	ProcessorOptions,
	"baseUrl" | "recmaPlugins" | "rehypePlugins" | "remarkPlugins" | "remarkRehypeOptions"
>;

export function compile(input: VFile, options: CompileOptions): Promise<VFile> {
	return compileMdx(input, {
		...options,
		format: "mdx",
		jsx: true,
		providerImportSource: "@/lib/content/mdx/components",
	});
}
