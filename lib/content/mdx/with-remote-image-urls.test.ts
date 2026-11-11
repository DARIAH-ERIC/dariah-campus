import { compile } from "@mdx-js/mdx";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";

import { withRemoteImageUrls } from "#/lib/content/mdx/with-remote-image-urls.ts";

const baseUrl = "https://raw.githubusercontent.com/DARIAH-ERIC/dariah-campus/refs/heads/content/example";

async function process(value: string) {
	const file = await compile(new VFile({ value, path: "content/en/resources/example/index.mdx" }), {
		format: "mdx",
		jsx: true,
		rehypePlugins: [[withRemoteImageUrls, { baseUrl, components: ["Figure", "ImageComparisonSlider"] }]],
	});

	return String(file);
}

describe("withRemoteImageUrls", () => {
	it("rewrites both comparison images to the selected branch", async () => {
		const value = await process('<ImageComparisonSlider left="/assets/left.png" right="/assets/right.png" />');

		expect(value).toContain(`left="${baseUrl}/public/assets/left.png"`);
		expect(value).toContain(`right="${baseUrl}/public/assets/right.png"`);
	});

	it("preserves remote URLs while rewriting the other image and leaving alt text alone", async () => {
		const value = await process(
			'<ImageComparisonSlider left="https://example.com/left.png" right="./right.png" leftAlt="/left" rightAlt="/right" />',
		);

		expect(value).toContain('left="https://example.com/left.png"');
		expect(value).toContain(`right="${baseUrl}/content/en/resources/example/right.png"`);
		expect(value).toContain('leftAlt="/left"');
		expect(value).toContain('rightAlt="/right"');
	});

	it("continues rewriting src on figures and Markdown images", async () => {
		const value = await process('<Figure src="/assets/figure.png" />\n\n![Image](/assets/image.png)');

		expect(value).toContain(`src="${baseUrl}/public/assets/figure.png"`);
		expect(value).toContain(`src="${baseUrl}/public/assets/image.png"`);
	});
});
