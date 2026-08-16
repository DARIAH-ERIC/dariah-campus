import type { ReactNode } from "react";

import { Domain } from "@/components/domain";
import { Language } from "@/components/language";
import { License } from "@/components/licence";
import { OriginalPublicationDate } from "@/components/original-publication-date";
import { PublicationDate } from "@/components/publication-date";
import { Sources } from "@/components/sources";
import type { ContentLanguage } from "@/lib/content/options";

interface ResourceDetailsProps {
	license: { label: string };
	locale: ContentLanguage;
	originalPublicationDate?: Date;
	publicationDate: Date;
	sources: Array<{ id: string; name: string }>;
}

export function ResourceDetails(props: Readonly<ResourceDetailsProps>): ReactNode {
	const { license, locale, originalPublicationDate, publicationDate, sources } = props;

	return (
		<dl className="flex flex-col gap-y-5">
			<Domain />
			<Language locale={locale} />
			<PublicationDate publicationDate={publicationDate} />
			{originalPublicationDate != null ? (
				<OriginalPublicationDate publicationDate={originalPublicationDate} />
			) : null}
			<License license={license} />
			<Sources sources={sources} />
		</dl>
	);
}
