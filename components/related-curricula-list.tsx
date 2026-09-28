import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ContentTypeIcon } from "#/components/content-type-icon.tsx";
import { Link } from "#/components/link.tsx";

interface RelatedCurriculaListProps {
	curricula: Array<{ id: string; title: string; href: string }>;
}

export function RelatedCurriculaList(props: Readonly<RelatedCurriculaListProps>): ReactNode {
	const { curricula } = props;

	const t = useTranslations("RelatedCurriculaList");

	if (curricula.length === 0) {
		return null;
	}

	const id = "related-curricula";

	return (
		<nav
			aria-labelledby={id}
			className="mx-auto mbe-12 space-y-3 border-bs border-neutral-200 py-12 inline-full max-inline-(--size-content)"
		>
			<h2 className="text-2xl font-bold" id={id}>
				{t("label")}
			</h2>
			<ul className="flex flex-col gap-y-4">
				{curricula.map((curriculum) => {
					const { id, title, href } = curriculum;

					return (
						<li key={id}>
							<Link
								className="flex items-center gap-x-1.5 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
								href={href}
							>
								<ContentTypeIcon className="shrink-0 text-brand-700 block-3 inline-3" kind="curriculum" />
								<span>{title}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
