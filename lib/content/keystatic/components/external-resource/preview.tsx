import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface ExternalResourcePreviewProps {
	subtitle: string;
	title: string;
}

export function ExternalResourcePreview(props: Readonly<ExternalResourcePreviewProps>): ReactNode {
	const { subtitle, title } = props;

	return (
		<NotEditable>
			<aside className="my-4 grid place-items-center justify-center gap-y-2 text-center text-neutral-800">
				<strong className="text-2xl font-bold">{title}</strong>
				<div className="text-neutral-500">{subtitle}</div>
				<div className="mt-2 inline-flex rounded-full bg-brand-700 px-4 py-2 leading-7 font-medium text-white no-underline transition select-none hover:bg-brand-900 focus:outline-none focus-visible:ring focus-visible:ring-brand-700">
					{"Go to this resource"}
				</div>
			</aside>
		</NotEditable>
	);
}
