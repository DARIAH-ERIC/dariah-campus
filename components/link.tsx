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
	const { children, ...rest } = props;

	return (
		<AriaLink
			{...rest}
			render={(domProps, renderProps) => {
				if ("href" in domProps && domProps.href && !renderProps.isDisabled) {
					return <NextLink {...domProps} />;
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
