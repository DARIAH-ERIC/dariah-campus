import "server-only";

import { createMdxProcessors, run, type TableOfContents } from "@acdh-oeaw/mdx-lib";
import type { MDXModule } from "mdx/types";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import type { Language } from "@/config/i18n.config";
import { createConfig as createMdxConfig } from "@/config/mdx.config";
import { useMDXComponents } from "@/mdx-components";

const createMdxProcessor = createMdxProcessors(createMdxConfig);

export interface MdxContent<T extends Record<string, unknown>> extends MDXModule {
	/** Added by `remark-mdx-frontmatter`. */
	frontmatter: T;
	/** Added by `@acdh-oeaw/mdx-lib#with-table-of-contents`. */
	tableOfContents: TableOfContents;
}

export const compileMdx = cache(async function compileMdx<T extends Record<string, unknown>>(
	content: string,
	locale: Language,
	baseUrl: URL,
): Promise<MdxContent<T>> {
	const processor = await createMdxProcessor(locale);
	const vfile = await processor.process({ path: baseUrl, value: content });
	return run(vfile, {
		...runtime,
		baseUrl,
		// @ts-expect-error JSX types are not compatible.
		useMDXComponents,
	}) as Promise<MdxContent<T>>;
});
