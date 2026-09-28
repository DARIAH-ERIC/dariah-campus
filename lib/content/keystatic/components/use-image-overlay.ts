import { useCallback, useEffect, useState } from "react";

export interface OverlayImageSize {
	blockPx: number;
	inlinePx: number;
}

/**
 * Markers draw themselves onto the image their parent renders, which is not an ancestor of the card they are edited
 * from. React context does not reach across the node views prosemirror mounts, so the overlay is looked up in the dom
 * and drawn into through a portal.
 *
 * `size` is the image's own size rather than the size it happens to be displayed at, so pixels shown to an author are
 * the ones they would measure in an image editor. It is `null` until the file has decoded.
 */
export function useImageOverlay(selector: string): {
	hasImage: boolean;
	initCard: (element: HTMLDivElement | null) => void;
	overlay: HTMLElement | null;
	size: OverlayImageSize | null;
} {
	const [overlay, setOverlay] = useState<HTMLElement | null>(null);
	const [hasImage, setHasImage] = useState(false);
	const [size, setSize] = useState<OverlayImageSize | null>(null);

	const initCard = useCallback(
		(element: HTMLDivElement | null) => {
			setOverlay(element?.closest("figure")?.querySelector<HTMLElement>(selector) ?? null);
		},
		[selector],
	);

	/** The image is chosen on the parent, which re-renders without re-rendering the cards underneath it. */
	useEffect(() => {
		if (overlay == null) {
			return;
		}

		const element = overlay;

		function read() {
			setHasImage(element.dataset.hasImage === "true");

			const image = element.querySelector("img");
			const next =
				image != null && image.naturalWidth > 0 ? { blockPx: image.naturalHeight, inlinePx: image.naturalWidth } : null;

			setSize((current) =>
				current?.inlinePx === next?.inlinePx && current?.blockPx === next?.blockPx ? current : next,
			);
		}

		read();

		const observer = new MutationObserver(read);
		observer.observe(element, { attributeFilter: ["data-has-image"] });
		/** `load` does not bubble, and a swapped-in image only reports its size once it has decoded. */
		element.addEventListener("load", read, { capture: true });

		return () => {
			observer.disconnect();
			element.removeEventListener("load", read, { capture: true });
		};
	}, [overlay]);

	return { hasImage, initCard, overlay, size };
}
