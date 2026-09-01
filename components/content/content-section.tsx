import { Fragment, type ReactElement, type ReactNode } from "react";

export interface ContentSectionProps {
	children: ReactNode;
	id: string;
}

/**
 * Wraps one section of a document which was split up with `<SplitPoint>`.
 *
 * By default every section is rendered. Pages which display a single section at a time pass a bound component via
 * `<Content components={{ ContentSection: createContentSection(id) }} />` instead.
 */
export function ContentSection(props: Readonly<ContentSectionProps>): ReactElement {
	const { children } = props;

	/** A fragment, because a section must not add markup which would change the spacing of the surrounding content. */
	// oxlint-disable-next-line react/jsx-no-useless-fragment
	return <Fragment>{children}</Fragment>;
}

/**
 * Creates a `<ContentSection>` which only renders the currently displayed section. Sections which are not displayed are
 * never rendered, so neither their markup nor their client components end up in the payload.
 */
export function createContentSection(
	currentSectionId: string,
): (props: Readonly<ContentSectionProps>) => ReactElement | null {
	return function CurrentContentSection(props: Readonly<ContentSectionProps>): ReactElement | null {
		const { children, id } = props;

		if (id !== currentSectionId) {
			return null;
		}

		// oxlint-disable-next-line react/jsx-no-useless-fragment -- See above.
		return <Fragment>{children}</Fragment>;
	};
}
