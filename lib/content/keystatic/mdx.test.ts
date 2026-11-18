import type * as Keystatic from "@keystatic/core";
import { beforeAll, expect, test } from "vitest";

// The Node entry point only reads raw MDX; the browser entry point parses editor state.
const browserEntry = new URL("./keystatic-core.js", import.meta.resolve("@keystatic/core"));
let fields: typeof Keystatic.fields;

beforeAll(async () => {
	({ fields } = (await import(browserEntry.href)) as typeof Keystatic);
});

test.each([
	["empty R code block", "Introduction\n\n```r\n```\n", ""],
	["empty code block without a language", "```\n```\n", ""],
	["nonempty R code block", "```r\nprint(1)\n```\n", "print(1)"],
])("MDX editor can load and round-trip: %s", (_label, content, code) => {
	const field = fields.mdx({ label: "Content" });
	const parse = (source: Uint8Array) =>
		field.parse(undefined, {
			content: source,
			other: new Map(),
			external: new Map(),
			slug: "test",
		});
	const value = parse(new TextEncoder().encode(content));
	const block = value.doc.lastChild;
	expect(block?.type.name).toBe("code_block");
	expect(block?.textContent).toBe(code);
	expect(block?.childCount).toBe(code ? 1 : 0);
	const serialized = field.serialize(value, { slug: "test" });
	if (serialized.content === undefined) {
		throw new Error("Expected serialized MDX content");
	}
	expect(parse(serialized.content).doc.toJSON()).toEqual(value.doc.toJSON());
});
