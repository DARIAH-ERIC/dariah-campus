/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { ProcessorOptions } from "@mdx-js/mdx";
import type { ElementContent } from "hast";
import { createTranslator } from "next-intl";

import type { IntlLocale } from "@/lib/i18n/locales";
import messages from "@/messages/en.json";

type RemarkRehypeOptions = NonNullable<ProcessorOptions["remarkRehypeOptions"]>;

export function createRemarkRehypeOptions(locale: IntlLocale) {
	const t = createTranslator({ locale, messages, namespace: "mdx" });

	return {
		/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L81 */
		footnoteBackContent(_, rereferenceIndex) {
			const result: Array<ElementContent> = [{ type: "text", value: "↩" }];

			if (rereferenceIndex > 1) {
				result.push({
					type: "element",
					tagName: "sup",
					properties: {},
					children: [{ type: "text", value: String(rereferenceIndex) }],
				});
			}

			return result;
		},
		/** @see https://github.com/syntax-tree/mdast-util-to-hast/blob/13.0.0/lib/footer.js#L108 */
		footnoteBackLabel(referenceIndex, rereferenceIndex) {
			return t("footnote-back-label", {
				reference:
					String(referenceIndex + 1) + (rereferenceIndex > 1 ? `-${String(rereferenceIndex)}` : ""),
			});
		},
		footnoteLabel: t("footnotes"),
		footnoteLabelProperties: { className: [] },
		footnoteLabelTagName: "h2",
	} satisfies RemarkRehypeOptions;
}
