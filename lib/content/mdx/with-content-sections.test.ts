import { compile } from "@mdx-js/mdx";
import withHeadingIds from "rehype-slug";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";

import { withContentSections } from "#/lib/content/mdx/with-content-sections.ts";

async function process(value: string) {
	const file = await compile(new VFile({ value }), {
		format: "mdx",
		jsx: true,
		rehypePlugins: [withHeadingIds, withContentSections],
	});

	return { sections: file.data.sections ?? [], value: String(file) };
}

describe("withContentSections", () => {
	it("leaves documents without split points alone", async () => {
		const { sections, value } = await process("## First\n\nHello.\n");

		expect(sections).toEqual([]);
		expect(value).not.toContain("ContentSection");
	});

	it("splits at top-level split points", async () => {
		const { sections } = await process(
			["## Intro", "", '<SplitPoint id="middle" />', "", "## Middle", "", '<SplitPoint id="end" />', "", "## End"].join(
				"\n",
			),
		);

		expect(sections.map((section) => section.id)).toEqual(["section-1", "middle", "end"]);
	});

	it("names the first section after the split point when the document starts with one", async () => {
		const { sections } = await process('<SplitPoint id="intro" />\n\n## Intro\n\n<SplitPoint id="end" />\n\n## End\n');

		expect(sections.map((section) => section.id)).toEqual(["intro", "end"]);
	});

	it("labels sections with their first heading, and records every heading in them", async () => {
		const { sections } = await process(
			["## Intro", "", "### Details", "", '<SplitPoint id="end" />', "", "## The End"].join("\n"),
		);

		expect(sections).toEqual([
			{ id: "section-1", label: "Intro", headingIds: ["intro", "details"] },
			{ id: "end", label: "The End", headingIds: ["the-end"] },
		]);
	});

	it("has no label for a section without headings", async () => {
		const { sections } = await process('Hello.\n\n<SplitPoint id="end" />\n\nGoodbye.\n');

		expect(sections.map((section) => section.label)).toEqual([null, null]);
	});

	it("wraps each section in a content section element", async () => {
		const { value } = await process('Hello.\n\n<SplitPoint id="end" />\n\nGoodbye.\n');

		expect(value).toContain('<ContentSection id="section-1">');
		expect(value).toContain('<ContentSection id="end">');
		expect(value).not.toContain("SplitPoint");
	});

	it("exports the sections from the compiled module", async () => {
		const { value } = await process('Hello.\n\n<SplitPoint id="end" />\n\nGoodbye.\n');

		expect(value).toContain("export const sections");
	});

	it("deduplicates repeated identifiers", async () => {
		const { sections } = await process(
			['<SplitPoint id="one" />', "", "a", "", '<SplitPoint id="one" />', "", "b"].join("\n"),
		);

		expect(sections.map((section) => section.id)).toEqual(["one", "one-2"]);
	});

	it("generates an identifier for a split point without one", async () => {
		const { sections } = await process(
			["a", "", "<SplitPoint />", "", "b", "", '<SplitPoint id="end" />', "", "c"].join("\n"),
		);

		expect(sections.map((section) => section.id)).toEqual(["section-1", "section-2", "end"]);
	});

	it("generates an identifier for a split point with an empty one", async () => {
		const { sections } = await process(["a", "", '<SplitPoint id="" />', "", "b"].join("\n"));

		expect(sections.map((section) => section.id)).toEqual(["section-1", "section-2"]);
	});

	/** Otherwise inserting an unnamed section renames a section the author did name. */
	it("never takes an identifier an author chose for a generated one", async () => {
		const { sections } = await process(
			["a", "", "<SplitPoint />", "", "b", "", '<SplitPoint id="section-2" />', "", "c"].join("\n"),
		);

		expect(sections.map((section) => section.id)).toEqual(["section-1", "section-2-2", "section-2"]);
	});

	it("ignores split points which are not top-level", async () => {
		const { sections, value } = await process('<div>\n  <SplitPoint id="nested" />\n</div>\n');

		expect(sections).toEqual([]);
		expect(value).not.toContain("SplitPoint");
	});
});
