import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DisclosureProps {
	children: ReactNode;
	title: string;
}

export function Disclosure(props: Readonly<DisclosureProps>): ReactNode {
	const { children, title } = props;

	return (
		<details className="group my-4 grid border-y open:pb-4">
			<summary className="my-3 inline-flex cursor-pointer list-none items-center justify-between gap-x-4 py-1 font-bold group-open:pb-0 hover:underline">
				<span>{title}</span>
				<ChevronDownIcon
					aria-hidden={true}
					className="size-5 shrink-0 text-neutral-500 group-open:rotate-180"
				/>
			</summary>
			<div className="[&_:first-child]:mt-0 [&_:last-child]:mb-0 [&_a]:underline [&_a:hover]:no-underline">
				{children}
			</div>
		</details>
	);
}
