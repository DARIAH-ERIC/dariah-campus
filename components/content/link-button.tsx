import cn from "clsx/lite";
import type { ReactNode } from "react";

import { Link } from "@/components/content/link";
import type { LinkSchema } from "@/lib/content";

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
				"inline-flex rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white no-underline transition select-none hover:bg-brand-900 focus-visible:ring focus-visible:ring-brand-700",
				className,
			)}
		>
			{children}
		</Link>
	);
}
