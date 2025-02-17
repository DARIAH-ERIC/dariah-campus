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
				"rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:ring focus-visible:ring-primary-600",
				className,
			)}
		>
			{children}
		</Link>
	);
}
