/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import type { AriaLabelingProps, DOMProps } from "@react-types/shared";

import { useId } from "@/lib/hooks/use-id";

/**
 * Copied from `react-aria`, because it currently does not work in server components.
 *
 * @see https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/useLabels.ts
 */
export function useLabels(
	props: AriaLabelingProps & DOMProps,
	defaultLabel?: string,
): AriaLabelingProps & DOMProps {
	let { id, "aria-label": label, "aria-labelledby": labelledBy } = props;

	/**
	 * If there is both an aria-label and aria-labelledby, combine them by pointing
	 * to the element itself.
	 */
	id = useId(id);
	if (labelledBy && label) {
		const ids = new Set([id, ...labelledBy.trim().split(/\s+/)]);
		labelledBy = [...ids].join(" ");
	} else if (labelledBy) {
		labelledBy = labelledBy.trim().split(/\s+/).join(" ");
	}

	/** If no labels are provided, use the default. */
	if (!label && !labelledBy && defaultLabel) {
		label = defaultLabel;
	}

	return {
		id,
		"aria-label": label,
		"aria-labelledby": labelledBy,
	};
}
