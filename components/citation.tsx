import { isNonEmptyArray } from "@acdh-oeaw/lib";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { CitationCopyButton } from "@/components/citation-copy-button";
import type { ContentType } from "@/lib/content/options";

interface CitationProps {
	authors: Array<{ id: string; name: string }>;
	contentType: ContentType | "curriculum" | "event" | "pathfinder";
	contributors?: Array<{ id: string; name: string }>;
	editors?: Array<{ id: string; name: string }>;
	publicationDate: Date;
	publisher?: string;
	title: string;
	url: string;
	version: string;
}

export function Citation(props: Readonly<CitationProps>): ReactNode {
	const {
		authors,
		contentType,
		contributors,
		editors,
		publicationDate,
		publisher = "DARIAH Campus",
		title,
		url,
		version,
	} = props;

	const t = useTranslations("Citation");
	const format = useFormatter();

	const citation = [
		format.list(
			[...authors, ...(contributors ?? [])].map((person) => {
				return person.name;
			}),
		),
		` (${String(publicationDate.getFullYear())}). `,
		title.endsWith("!") || title.endsWith("?") ? `${title} ` : `${title}. `,
		version ? `Version ${version}. ` : "",
		isNonEmptyArray(editors)
			? `Edited by ${format.list(
					editors.map((person) => {
						return person.name;
					}),
				)}. `
			: "",
		publisher,
		` [${t(`content-types.${contentType}`)}]. `,
		url,
	].join("");

	return (
		<div className="space-y-1.5">
			<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("cite-as")}</h2>
			<p>{citation}</p>
			<CitationCopyButton citation={citation}>{t("copy-citation")}</CitationCopyButton>
		</div>
	);
}
