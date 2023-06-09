import { runSync } from "@mdx-js/mdx";
import { type FC } from "react";
import * as runtime from "react/jsx-runtime";

import { type MdxComponentMap } from "@/mdx/components";

export interface MdxContentProps {
	components?: MdxComponentMap;
}

export interface Mdx<T extends Record<string, unknown> = Record<string, unknown>> {
	/** Mdx content as React component. */
	MdxContent: FC<MdxContentProps>;
	/** Properties exported from mdx. */
	metadata?: T;
}

/**
 * Evaluates pre-compiled mdx.
 */
export function runMdxSync<T extends Record<string, unknown> = Record<string, unknown>>(
	code: string,
): Mdx<T> {
	const { default: MdxContent, ...metadata } = runSync(code, runtime);

	return { MdxContent, metadata };
}
