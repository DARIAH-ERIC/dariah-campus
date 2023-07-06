import Link, { type LinkProps } from "next/link";
import { type ReactNode } from "react";

import { type RouteMatcher, useCurrentRoute } from "@/navigation/useCurrentRoute";

export interface NavLinkProps extends LinkProps {
	children: ReactNode;
	isMatching?: RouteMatcher;
	className?: string | ((isCurrent: boolean) => string);
}

/**
 * Navigation link, sets `aria-current`.
 */
export function NavLink(props: NavLinkProps): JSX.Element {
	const { href, isMatching, children, className } = props;

	const isCurrent = useCurrentRoute(href, isMatching);

	return (
		<Link
			href={href}
			aria-current={isCurrent ? "page" : undefined}
			className={typeof className === "function" ? className(isCurrent) : className}
		>
			{children}
		</Link>
	);
}
