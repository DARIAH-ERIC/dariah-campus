import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { resources as sharedMetadata } from "@/config/shared-metadata.config";
import type { ContentLanguage, ContentType } from "@/lib/content/options";

interface ResourceMetadataProps {
	authors: Array<{ id: string; name: string }>;
	contentType: ContentType | "curriculum" | "event" | "pathfinder";
	license: { value: string; label: string };
	locale: ContentLanguage;
	publicationDate: Date;
	remotePublicationDate?: Date;
	sources: Array<{ id: string; name: string }>;
	tags: Array<{ id: string; name: string }>;
	title: string;
	version: string;
}

export function ResourceMetadata(props: ResourceMetadataProps): ReactNode {
	const {
		authors,
		contentType,
		publicationDate,
		license,
		locale,
		remotePublicationDate,
		sources,
		tags,
		title,
		version,
	} = props;
	const { domain } = sharedMetadata;

	const t = useTranslations("FullMetadata");
	const format = useFormatter();

	return (
		<div className="mx-auto mt-12 w-full max-w-content space-y-3 border-t border-neutral-200 py-12">
			<h2 className="text-xs font-bold uppercase tracking-wide text-neutral-600">{t("label")}</h2>
			<dl className="flex flex-col space-y-1.5 text-sm text-neutral-500">
				<div className="flex space-x-1.5">
					<dt>{t("title")}:</dt>
					<dd>{title}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("authors")}:</dt>
					<dd>
						{authors
							.map((person) => {
								return person.name;
							})
							.join(", ")}
					</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("domain")}:</dt>
					<dd>{domain}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("language")}:</dt>
					<dd>{locale}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("publication-date")}:</dt>
					<dd>{format.dateTime(publicationDate)}</dd>
				</div>
				{remotePublicationDate ? (
					<div className="flex space-x-1.5">
						<dt>{t("remote-publication-date")}:</dt>
						<dd>{format.dateTime(remotePublicationDate)}</dd>
					</div>
				) : null}
				<div className="flex space-x-1.5">
					<dt>{t("content-type")}:</dt>
					<dd>{t(`content-types.${contentType}`)}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("license")}:</dt>
					<dd>{license.label}</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("sources")}:</dt>
					<dd>
						{sources
							.map((source) => {
								return source.name;
							})
							.join(", ")}
					</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("tags")}:</dt>
					<dd>
						{tags
							.map((tag) => {
								return tag.name;
							})
							.join(", ")}
					</dd>
				</div>
				<div className="flex space-x-1.5">
					<dt>{t("version")}:</dt>
					<dd>{version}</dd>
				</div>
			</dl>
		</div>
	);
}
