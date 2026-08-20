/** Elements which must never end up in a downloadable document. */
const strippedSelector = "script, style, template, noscript, iframe, object, embed";

/**
 * Serialises rendered rich text into plain html for the downloadable document.
 *
 * The rendered markup carries app styling, which the document has no stylesheet for, so every attribute is
 * dropped and only the semantic elements are kept. Links keep their `href`, resolved to an absolute url,
 * because the document is read outside of the site.
 */
export function serializeRichText(element: HTMLElement | null | undefined): string | undefined {
	if (element == null) {return undefined;}

	const clone = element.cloneNode(true) as HTMLElement;

	clone.querySelectorAll(strippedSelector).forEach((node) => {
		node.remove();
	});

	clone.querySelectorAll("*").forEach((node) => {
		/** `href` on an anchor element is already resolved against the document's base url. */
		const href = node instanceof HTMLAnchorElement ? node.href : null;

		Array.from(node.attributes).forEach((attribute) => {
			node.removeAttribute(attribute.name);
		});

		if (href != null) {
			node.setAttribute("href", href);
		}
	});

	const html = clone.innerHTML.trim();

	return html.length > 0 ? html : undefined;
}
