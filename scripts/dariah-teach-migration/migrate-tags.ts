import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ErrnoException } from "fast-glob/out/types";

interface TagFile {
	data: Array<Tag>;
}

interface Tag {
	id: string;
	userid: string;
	name: string;
	rawname: string;
	isstandard: number;
	description: null | undefined;
	descriptionformat: string;
	flag: string;
	timemodified: string;
}

const tagFileContent: string = readFileSync(join(import.meta.dirname, "tag.json"), "utf-8");
const { data: dariahTeachTags } = (JSON.parse(tagFileContent) as Array<TagFile>)[2]!;

dariahTeachTags
	.filter((tag) => {
		return ![";", "/"].some((char) => {
			return tag.name.includes(char);
		});
	})
	.forEach((dhTag) => {
		const { name, rawname } = dhTag;
		const tagContent = `---\nname: ${rawname}\n---`;
		const path = name.replace(/\s/g, "-");
		try {
			mkdirSync(`./content/en/tags/${path}`, { recursive: true });
			writeFileSync(`./content/en/tags/${path}/index.mdx`, tagContent, { flag: "wx" });
		} catch (err) {
			const error = err as ErrnoException;
			if (error.code === "EEXIST") {
				console.warn("Tag exists, not created");
			}
		}
	});
