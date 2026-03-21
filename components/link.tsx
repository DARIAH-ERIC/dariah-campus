"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ReactNode } from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";

export interface LinkProps
	extends AriaLinkProps, Pick<NextLinkProps, "prefetch" | "replace" | "scroll" | "shallow"> {
	href?: string | undefined;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	const { children, prefetch, replace, scroll, shallow, ...rest } = props;

	return (
		<AriaLink
			render={(domProps, renderProps) => {
				if ("href" in domProps && Boolean(domProps.href) && !renderProps.isDisabled) {
					return (
						<NextLink
							prefetch={prefetch}
							replace={replace}
							scroll={scroll}
							shallow={shallow}
							{...domProps}
						/>
					);
				}

				return <span {...domProps} />;
			}}
			{...rest}
		>
			{children}
		</AriaLink>
	);
}
