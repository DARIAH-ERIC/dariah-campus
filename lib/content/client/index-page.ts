import singleton from "@content/index-page";

import type { SingletonClient } from "@/lib/content/types";

const item = singleton.get("")!.document;

export type IndexPage = typeof item;

export const client: SingletonClient<IndexPage> = {
	get() {
		return Promise.resolve(item);
	},
};
