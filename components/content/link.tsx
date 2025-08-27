import type { ReactNode } from "react";

import { Link as Anchor } from "@/components/link";
import { getLinkProps, type LinkSchema } from "@/lib/content";

interface LinkProps {
	children: ReactNode;
	className?: string;
	link: LinkSchema;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	const { children, link, ...rest } = props;

	return (
		<Anchor {...rest} {...getLinkProps(link)}>
			{children}
		</Anchor>
	);
}
