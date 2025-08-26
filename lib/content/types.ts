import type * as runtime from "react/jsx-runtime";

import type { components } from "@/lib/content/mdx-components";
import type { IntlLanguage } from "@/lib/i18n/locales";

declare global {
	type MDXProvidedComponents = typeof components;
}

declare module "mdx/types" {
	namespace JSX {
		type Element = runtime.JSX.Element;
		type ElementClass = runtime.JSX.ElementClass;
		type IntrinsicElements = runtime.JSX.IntrinsicElements;
	}
}

declare module "@acdh-oeaw/mdx-lib" {
	export interface MdxConfig {
		locales: IntlLanguage;
	}
}

export interface CollectionClient<T extends { id: string }> {
	ids: () => Array<string>;
	all: () => Array<T>;
	byId: () => Map<string, T>;
	get: (id: T["id"]) => T | null;
}

export interface SingletonClient<T> {
	get: () => T;
}

export interface Client {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	collections: Record<string, CollectionClient<any>>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	singletons: Record<string, SingletonClient<any>>;
}
