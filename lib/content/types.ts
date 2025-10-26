import type { components } from "@/lib/content/mdx/components";
import type { IntlLanguage } from "@/lib/i18n/locales";

declare global {
	type MDXProvidedComponents = typeof components;
}

declare module "@acdh-oeaw/mdx-lib" {
	export interface MdxConfig {
		locales: IntlLanguage;
	}
}

export interface CollectionClient<T extends { id: string }> {
	ids: () => Promise<Array<string>>;
	all: () => Promise<Array<T>>;
	byId: () => Promise<Map<string, T>>;
	get: (id: T["id"]) => Promise<T | null>;
}

export interface SingletonClient<T> {
	get: () => Promise<T>;
}

export interface Client {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	collections: Record<string, CollectionClient<any>>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	singletons: Record<string, SingletonClient<any>>;
}
