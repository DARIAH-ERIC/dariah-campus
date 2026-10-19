import { NotEditable } from "@keystatic/core";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DisclosurePreviewProps {
	children: ReactNode;
	title: string;
}

export function DisclosurePreview(props: Readonly<DisclosurePreviewProps>): ReactNode {
	const { children, title } = props;

	return (
		<details className="group my-4 flex flex-col border-y border-neutral-200 open:pbe-4" open={true}>
			<summary className="my-3 inline-flex cursor-pointer list-none py-1 font-bold group-open:pbe-0 hover:underline focus:outline-none">
				<NotEditable className="inline-flex flex-1 items-center justify-between gap-x-4">
					<span>{title || "(Disclosure title)"}</span>
					<ChevronDownIcon
						aria-hidden={true}
						className="shrink-0 text-neutral-500 transition block-5 inline-5 group-open:rotate-180"
					/>
				</NotEditable>
			</summary>
			<div className="**:first:mbs-0 **:last:mbe-0 [&_a]:underline [&_a:hover]:no-underline">{children}</div>
		</details>
	);
}
