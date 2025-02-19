"use client";

import { filterDOMProps, mergeRefs } from "@react-aria/utils";
import {
	type ComponentPropsWithoutRef,
	type ElementType,
	type ReactNode,
	type Ref,
	useMemo,
	useRef,
} from "react";
import {
	mergeProps,
	useFocusable,
	useFocusRing,
	useHover,
	useObjectRef,
	usePress,
} from "react-aria";
import type { LinkProps as AriaLinkProps } from "react-aria-components";

import { LocaleLink, type LocaleLinkProps } from "@/lib/i18n/navigation";
import { useRenderProps } from "@/lib/use-render-props";

/**
 * Not using `Link` from `react-aria-components` directly, because we want `next/link`'s built-in
 * prefetch behavior.
 *
 * @see https://github.com/vercel/next.js/discussions/73381
 *
 * @see https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Link.tsx
 * @see https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/link/src/useLink.ts
 */

export interface LinkProps
	extends Pick<LocaleLinkProps, "href" | "prefetch" | "replace" | "scroll" | "shallow">,
		Omit<AriaLinkProps, "elementType" | "href" | "routerOptions" | "slot">,
		Pick<ComponentPropsWithoutRef<"a">, "aria-current" | "id"> {
	ref?: Ref<HTMLAnchorElement | HTMLSpanElement> | undefined;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	/** Ensure `className` is passed to `mergProps` only once to avoid duplication. */
	const { className: _, ...interactionProps } = props;

	const forwardedRef = props.ref;
	const ref = useRef<HTMLAnchorElement | HTMLSpanElement>(null);
	const linkRef = useObjectRef(
		useMemo(() => {
			// eslint-disable-next-line react-compiler/react-compiler
			return mergeRefs(forwardedRef, ref);
		}, [forwardedRef, ref]),
	);

	const isDisabled = props.isDisabled === true;
	const isCurrent = Boolean(props["aria-current"]);
	const isLinkElement = Boolean(props.href) && !isDisabled;
	const ElementType: ElementType = isLinkElement ? LocaleLink : "span";

	const { focusableProps } = useFocusable(interactionProps, linkRef);
	const { pressProps, isPressed } = usePress({ ...interactionProps, ref: linkRef });
	const { hoverProps, isHovered } = useHover(interactionProps);
	const { focusProps, isFocused, isFocusVisible } = useFocusRing();

	const renderProps = useRenderProps({
		...props,
		values: {
			isCurrent,
			isDisabled,
			isPressed,
			isHovered,
			isFocused,
			isFocusVisible,
		},
	});

	return (
		<ElementType
			ref={linkRef}
			{...mergeProps(
				renderProps,
				filterDOMProps(props, { labelable: true, isLink: isLinkElement }),
				focusableProps,
				pressProps,
				hoverProps,
				focusProps,
			)}
			aria-disabled={isDisabled || undefined}
			data-current={isCurrent || undefined}
			data-disabled={isDisabled || undefined}
			data-focus-visible={isFocusVisible || undefined}
			data-focused={isFocused || undefined}
			data-hovered={isHovered || undefined}
			data-pressed={isPressed || undefined}
			data-rac=""
			role={!isLinkElement ? "link" : undefined}
		>
			{renderProps.children}
		</ElementType>
	);
}
