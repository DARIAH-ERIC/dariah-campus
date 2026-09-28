import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DisclosureProps {
	children: ReactNode;
	title: string;
}

export function Disclosure(props: Readonly<DisclosureProps>): ReactNode {
	const { children, title } = props;

	return (
		<details className="group my-4 flex flex-col border-y border-neutral-200 open:pbe-4">
			<summary className="my-3 inline-flex cursor-pointer list-none items-center justify-between gap-x-4 py-1 font-bold group-open:pbe-0 hover:underline">
				<span>{title}</span>
				<ChevronDownIcon
					aria-hidden={true}
					className="shrink-0 text-neutral-500 block-5 inline-5 group-open:rotate-180"
				/>
			</summary>
			<div className="**:first:mbs-0 **:last:mbe-0 [&_a]:underline [&_a:hover]:no-underline">{children}</div>
		</details>
	);
}
