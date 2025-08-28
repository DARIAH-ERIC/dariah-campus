import { compile as compileMdx, evaluate as evaluateMdx, type ProcessorOptions } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import type { VFile } from "vfile";

import { useMDXComponents } from "@/lib/content/mdx/components";

export type EvaluateOptions = Pick<
	ProcessorOptions,
	"baseUrl" | "recmaPlugins" | "rehypePlugins" | "remarkPlugins" | "remarkRehypeOptions"
>;

type MDXModule<TNamedExports = never> = TNamedExports & {
	default: MDXContent;
};

export function compile(input: VFile, options: EvaluateOptions): Promise<VFile> {
	return compileMdx(input, {
		...options,
		format: "mdx",
		jsx: true,
		providerImportSource: "@/lib/content/mdx/components",
	});
}

export function evaluate<TNamedExports = never>(
	value: string,
	config: EvaluateOptions,
): Promise<MDXModule<TNamedExports>> {
	return evaluateMdx(
		{ value },
		{
			...config,
			...runtime,
			// baseUrl,
			format: "mdx",
			// @ts-expect-error Type error probably because of ReactNode return type.
			useMDXComponents,
		},
	) as Promise<MDXModule<TNamedExports>>;
}
