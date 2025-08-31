"use client";

import type { ReactNode } from "react";

import { Link, type LinkProps } from "@/components/link";
import { useNavLink } from "@/lib/navigation/use-nav-link";

export interface NavLinkProps extends LinkProps {}

export function NavLink(props: Readonly<NavLinkProps>): ReactNode {
	const { children, ...rest } = props;

	const navLinkProps = useNavLink(rest);

	return (
		<Link {...rest} {...navLinkProps}>
			{children}
		</Link>
	);
}
