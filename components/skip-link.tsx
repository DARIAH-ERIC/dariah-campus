import cn from "clsx/lite";
import type { ComponentProps, ReactNode } from "react";

interface SkipLinkProps extends ComponentProps<"a"> {
	children: ReactNode;
	href: `#${string}`;
}

export function SkipLink(props: Readonly<SkipLinkProps>): ReactNode {
	const { children, className, href, ...rest } = props;

	return (
		<a {...rest} className={cn("absolute", className)} href={href}>
			{children}
		</a>
	);
}
