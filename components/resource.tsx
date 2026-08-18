import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { createUrl } from "@acdh-oeaw/lib";
import { PencilIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Attachments } from "#/components/attachments.tsx";
import { Image } from "#/components/image.tsx";
import { Links } from "#/components/links.tsx";
import { Organisations } from "#/components/organisations.tsx";
import { PageTitle } from "#/components/page-title.tsx";
import { People } from "#/components/people.tsx";
import { SocialMediaShareLinks } from "#/components/social-media-share-links.tsx";
import { SocialMedia } from "#/components/social-media.tsx";
import { Tags } from "#/components/tags.tsx";
import { TranslationOf } from "#/components/translation-of.tsx";
import { Translations } from "#/components/translations.tsx";
import { env } from "#/configs/env.config.ts";
import type { SocialMediaKind } from "#/lib/content/options.ts";
import { getIntlLanguage } from "#/lib/i18n/locales.ts";
import { createFullUrl } from "#/lib/navigation/create-full-url.ts";

interface ResourceProps {
	attachments?: Array<{ label: string; file: string }>;
	authors: Array<{
		id: string;
		image: StaticImageData | string;
		name: string;
	}>;
	children: ReactNode;
	collection: string;
	endDate?: Date;
	featuredImage?: StaticImageData | string | null;
	href: string;
	id: string;
	isTranslationOf: { id: string; href: string; title: string; locale: string } | null;
	links?: Array<{ label: string; href: string }>;
	location?: string;
	organisations?: ReadonlyArray<{ name: string; url: string; logo: StaticImageData | string }>;
	social?: ReadonlyArray<{ discriminant: SocialMediaKind; value: string }>;
	startDate?: Date;
	tags: Array<{ id: string; name: string }>;
	title: string;
	translations: Array<{ id: string; href: string; title: string; locale: string }>;
}

export function Resource(props: Readonly<ResourceProps>): ReactNode {
	const {
		attachments = [],
		authors,
		children,
		collection,
		href: _href,
		endDate,
		featuredImage,
		id,
		isTranslationOf,
		links = [],
		location,
		organisations = [],
		social = [],
		startDate,
		tags,
		title,
		translations,
	} = props;

	const locale = useLocale();
	const t = useTranslations("Resource");
	const format = useFormatter();

	const href = String(createFullUrl({ baseUrl: env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL, pathname: _href }));

	return (
		<article className="mx-auto space-y-10 inline-full max-inline-(--size-content)">
			<header className="space-y-10">
				<PageTitle>{title}</PageTitle>
				<div className="space-y-6 border-y border-neutral-200 py-10 xl:hidden">
					{location != null ? (
						<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
							<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("location")}</div>
							<div>{location}</div>
						</div>
					) : null}
					{startDate ? (
						<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
							<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("date")}</div>
							<div>
								{endDate
									? format.dateTimeRange(startDate, endDate, { dateStyle: "long" })
									: format.dateTime(startDate, { dateStyle: "long" })}
							</div>
						</div>
					) : null}
					<People label={t("authors")} people={authors} />
					<Tags label={t("tags")} tags={tags} />
					<Translations label={t("translations")} translations={translations} />
					<TranslationOf label={t("is-translation-of")} resource={isTranslationOf} />
					<SocialMedia label={t("social-media")} social={social} />
					<Organisations label={t("organized-by")} organisations={organisations} />
					<Attachments attachments={attachments} label={t("attachments")} />
					<Links label={t("links")} links={links} />
				</div>
			</header>
			<div>
				{featuredImage != null ? (
					<Image
						alt=""
						className="mbe-8 overflow-hidden rounded-lg border border-neutral-200 object-cover inline-full"
						preload={true}
						sizes="720px"
						src={featuredImage}
					/>
				) : null}
				{children}
			</div>
			<footer className="pbs-2">
				<SocialMediaShareLinks href={href} title={title} />
				<div className="flex justify-end text-end">
					<a
						className="inline-flex items-center gap-x-1.5 text-end text-sm text-brand-700 transition hover:text-brand-800 hover:underline focus:outline-none focus-visible:ring focus-visible:ring-brand-800"
						href={String(
							createUrl({
								baseUrl: env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL,
								pathname: `/keystatic/branch/main/collection/${encodeURIComponent(withI18nPrefix(collection, getIntlLanguage(locale)))}/item/${encodeURIComponent(id)}`,
							}),
						)}
						target="_blank"
					>
						<PencilIcon className="shrink-0 block-4 inline-4" />
						<span className="text-end">{t("suggest-changes-to-resource")}</span>
					</a>
				</div>
			</footer>
		</article>
	);
}
