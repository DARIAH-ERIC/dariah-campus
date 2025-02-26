import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Link } from "@/components/content/link";
import type { LinkSchema } from "@/lib/keystatic/get-link-props";

interface LinkButtonProps {
	children: ReactNode;
	className?: string;
	link: LinkSchema;
}

export function LinkButton(props: Readonly<LinkButtonProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<Link
			{...rest}
			className={cn(
				"inline-flex select-none rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-brand-900 focus-visible:ring focus-visible:ring-brand-700",
				className,
			)}
		>
			{children}
		</Link>
	);
}
