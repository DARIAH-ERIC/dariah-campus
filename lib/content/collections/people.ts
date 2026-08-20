import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "#/lib/content/keystatic/reader.ts";
import { type CompileOptions, compile } from "#/lib/content/mdx/compile.ts";
import { createGitHubMarkdownPlugin, createTypographicQuotesPlugin } from "#/lib/content/mdx/remark-plugins.ts";
import { createRemarkRehypeOptions } from "#/lib/content/mdx/remark-rehype-options.ts";
import { getImageDimensions } from "#/lib/content/utils/get-image-dimensions.ts";
import { defaultLocale, getIntlLanguage } from "#/lib/i18n/locales.ts";

const locale = defaultLocale;

const compileOptions: CompileOptions = {
  remarkPlugins: [createGitHubMarkdownPlugin(), createTypographicQuotesPlugin(getIntlLanguage(locale))],
  remarkRehypeOptions: createRemarkRehypeOptions(locale),
  rehypePlugins: [],
};

export const people = createCollection({
  name: "people",
  directory: "./content/en/people/",
  include: ["*/index.mdx"],
  read(item) {
    return reader.collections["en:people"].readOrThrow(item.id, { resolveLinkedFiles: true });
  },
  async transform(data, item, context) {
    const { content, ...metadata } = data;

    const input = new VFile({ path: item.absoluteFilePath, value: content });
    const output = await compile(input, compileOptions);
    const module = context.createJavaScriptImport<MDXContent>(String(output));
    const image = await getImageDimensions(metadata.image);

    return {
      id: item.id,
      content: module,
      metadata: {
        ...metadata,
        image,
        /** The body as plain text, for contexts which cannot render the compiled mdx, e.g. a search filter chip. */
        description: content.trim(),
      },
    };
  },
});
