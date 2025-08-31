import type { ReactNode } from "react";

import { Link } from "@/components/link";

interface TranslationsListProps {
	label: string;
	translations: Array<{ id: string; href: string; title: string; locale: string }>;
}

export function TranslationsList(props: Readonly<TranslationsListProps>): ReactNode {
	const { label, translations } = props;

	if (translations.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</div>
			<div>
				<ul className="grid content-start gap-y-1">
					{translations.map((translation, index) => {
						const { href, title, locale } = translation;

						return (
							<li key={index}>
								<Link
									className="transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={href}
								>
									{title} ({locale})
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
