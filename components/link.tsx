"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";

export interface LinkProps
	extends
		Pick<NextLinkProps, "onNavigate" | "prefetch" | "replace" | "scroll" | "shallow">,
		Omit<AriaLinkProps, "elementType" | "href" | "render" | "routerOptions" | "slot">,
		Pick<ComponentPropsWithoutRef<"a">, "aria-current"> {
	href?: string | undefined;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	const { children, onNavigate, prefetch, replace, scroll, shallow, ...rest } = props;

	return (
		<AriaLink
			{...rest}
			render={(domProps, renderProps) => {
				if ("href" in domProps && domProps.href && !renderProps.isDisabled) {
					/** `react-aria` filters out props which are not dom attributes, so pass `next/link` props explicitly. */
					return (
						<NextLink
							{...domProps}
							onNavigate={onNavigate}
							prefetch={prefetch}
							replace={replace}
							scroll={scroll}
							shallow={shallow}
						/>
					);
				}

				return (
					<span
						{...domProps}
						// @ts-expect-error -- Link may be disabled but have `href`.
						href={undefined}
					/>
				);
			}}
		>
			{children}
		</AriaLink>
	);
}
