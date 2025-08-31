import { createCollection } from "@acdh-oeaw/content-lib";

import { reader } from "@/lib/content/keystatic/reader";

export const navigation = createCollection({
	name: "navigation",
	directory: "./content/en/navigation/",
	include: ["index.json"],
	read() {
		return reader.singletons["en:navigation"].readOrThrow({ resolveLinkedFiles: true });
	},
	transform(data) {
		return data;
	},
});
