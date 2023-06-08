import type * as Hast from "hast";
import withHeadingLinks from "rehype-autolink-headings";
import { type Pluggable } from "unified";

/**
 * Returns preconfigured `rehype-autolink-headings` plugin.
 */
const plugin: Pluggable<[withHeadingLinks.Options]> = [
	withHeadingLinks,
	{
		/**
		 * Adds links to headings.
		 *
		 * Currently follows the pattern also used on GitHub:
		 * prepend the heading-content with an aria-hidden link.
		 *
		 * Potentially more accecssible approaches:
		 * - https://github.com/remarkjs/remark-autolink-headings/issues/49#issuecomment-553945053
		 * - https://github.com/remarkjs/remark-autolink-headings/issues/49#issuecomment-553654194
		 */
		content(heading: Hast.Element): Array<Hast.Element> {
			heading.properties = heading.properties ?? {};
			heading.properties.className = (heading.properties.className ?? []) as Array<string>;
			heading.properties.className.push("relative");
			heading.properties.className.push("group");
			/** Allows identifying headings for table of contents highlighting. */
			heading.properties.className.push(headingAnchorClassName);

			return [
				{
					type: "element",
					tagName: "span",
					properties: {
						className: [
							"absolute",
							"top-0",
							"right-full",
							"pr-2",
							"text-neutral-500",
							"no-underline",
							"transition",
							"opacity-0",
							"group-hover:opacity-100",
						],
					},
					children: [{ type: "text", value: "#" }],
				},
			];
		},
	},
];

export default plugin;

/** Allows identifying headings for table of contents highlighting. */
export const headingAnchorClassName = "heading-anchor";
