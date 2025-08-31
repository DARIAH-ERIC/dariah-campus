import singleton from "@content/legal-notice";

import type { SingletonClient } from "@/lib/content/types";

const item = singleton.get("")!.document;

export type LegalNotice = typeof item;

export const client: SingletonClient<LegalNotice> = {
	get() {
		return Promise.resolve(item);
	},
};
