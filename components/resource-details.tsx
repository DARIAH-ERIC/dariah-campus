import type { ReactNode } from "react";

import { Domain } from "#/components/domain.tsx";
import { Language } from "#/components/language.tsx";
import { License } from "#/components/licence.tsx";
import { OriginalPublicationDate } from "#/components/original-publication-date.tsx";
import { PublicationDate } from "#/components/publication-date.tsx";
import { Sources } from "#/components/sources.tsx";
import type { ContentLanguage } from "#/lib/content/options.ts";

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
			{originalPublicationDate != null ? <OriginalPublicationDate publicationDate={originalPublicationDate} /> : null}
			<License license={license} />
			<Sources sources={sources} />
		</dl>
	);
}
