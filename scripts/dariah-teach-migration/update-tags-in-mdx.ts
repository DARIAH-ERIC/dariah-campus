import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import fg from "fast-glob";
import { dump } from "js-yaml";
import type { Root } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import fromMarkdown from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import { matter } from "vfile-matter";

import type { FrontmatterData } from "@/scripts/dariah-teach-migration/types";

const resourcesPath = "./content/en/resources/hosted";

const resourceFolderName = process.argv.slice(2)[0];
let mdxPaths: Array<string> = [];

const transformTags = () => {
	return function transformer(tree: Root, file: VFile): Root {
		matter(file);
		const frontmatter = file.data.matter as FrontmatterData;

		if (Array.isArray(frontmatter.tags)) {
			frontmatter.tags = frontmatter.tags.map((tag: string) => {
				return tag.toLowerCase();
			});
		}
		const updatedFrontmatter = dump(frontmatter);

		visit(tree, "yaml", (node) => {
			node.value = updatedFrontmatter;
		});
		return tree;
	};
};

const processor = unified()
	.use(fromMarkdown)
	.use(remarkFrontmatter)
	.use(remarkGfm)
	.use(remarkMdx)
	.use(transformTags)
	.use(remarkStringify);

if (resourceFolderName) {
	const resourcesPattern = `${resourcesPath}/${resourceFolderName}*/index.mdx`;
	mdxPaths.push(path.join("content/en/curricula", resourceFolderName, "index.mdx"));
	// eslint-disable-next-line import-x/no-named-as-default-member
	mdxPaths = mdxPaths.concat(fg.sync(resourcesPattern));
}

for (const mdxPath of mdxPaths) {
	const mdxContent = readFileSync(mdxPath, "utf-8");
	await processor.process(mdxContent).then((updatedContent) => {
		writeFileSync(mdxPath, String(updatedContent), "utf-8");
	});
}
