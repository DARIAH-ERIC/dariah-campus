import type { ReactNode } from "react";

import { createResourceUrl } from "@/app/(app)/resources/_lib/create-resource-url";
import { Link } from "@/components/link";

interface TranslationsProps {
	label: string;
	translations: Array<{ id: string; collection: string; title: string; locale: string }>;
}

export function Translations(props: TranslationsProps): ReactNode {
	const { label, translations } = props;

	if (translations.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</div>
			<div>
				<ul className="grid content-start gap-y-1">
					{translations.map((translation, index) => {
						const { id, collection, title, locale } = translation;

						return (
							<li key={index}>
								<Link
									className="transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={createResourceUrl({ id, collection })}
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
