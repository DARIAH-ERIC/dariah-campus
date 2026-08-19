/**
 * Images are capped at this block size, so a tall image does not push the surrounding ui out of view.
 */
const maxBlockSize = "min(60vh, 32rem)";

/**
 * Returns a `max-inline-size` which constrains an image to the available inline size, as well as to
 * {@link maxBlockSize}.
 *
 * Note that the block size constraint is intentionally expressed as an inline size, derived from the image's
 * aspect ratio. Combining `max-block-size` with `inline-size: auto` would make the intrinsic size of the image
 * decide its layout size, and that intrinsic size is the size of the selected `srcset` candidate divided by
 * its density - which is not the actual size of the image, because the image optimizer never upscales. With
 * the density descriptors which `next/image` generates by default, a `2x` candidate served from a smaller
 * source therefore lays out at half size on high-dpi displays. Adding a `sizes` prop does not help, it only
 * changes the density which is divided by. Keeping `inline-size` at the value provided by the `width`
 * attribute avoids this entirely.
 */
export function getImageMaxInlineSize(width: number | undefined, height: number | undefined): string {
	if (width == null || height == null || height === 0) {
		return "100%";
	}

	return `min(100%, ${maxBlockSize} * ${String(width / height)})`;
}
