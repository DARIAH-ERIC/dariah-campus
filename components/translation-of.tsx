import type { ReactNode } from "react";

import { Link } from "@/components/link";

interface TranslationOfProps {
	label: string;
	resource: { id: string; href: string; title: string; locale: string } | null;
}

export function TranslationOf(props: Readonly<TranslationOfProps>): ReactNode {
	const { label, resource } = props;

	if (resource == null) {
		return null;
	}

	const { href, title, locale } = resource;

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</div>
			<div>
				<Link
					className="transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
					href={href}
				>
					{title} ({locale})
				</Link>
			</div>
		</div>
	);
}
