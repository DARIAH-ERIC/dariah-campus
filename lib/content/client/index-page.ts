import type { SingletonClient } from "#/lib/content/types.ts";
import singleton from "#content/index-page";

const item = singleton.get("")!.document;

export type IndexPage = typeof item;

export const client: SingletonClient<IndexPage> = {
	get() {
		return Promise.resolve(item);
	},
};
