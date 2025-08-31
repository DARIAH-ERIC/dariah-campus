import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { createUrl } from "@acdh-oeaw/lib";
import { PencilIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Attachments } from "@/components/attachments";
import { Image } from "@/components/image";
import { Links } from "@/components/links";
import { Organisations } from "@/components/organisations";
import { PageTitle } from "@/components/page-title";
import { People } from "@/components/people";
import { SocialMedia } from "@/components/social-media";
import { SocialMediaShareLinks } from "@/components/social-media-share-links";
import { Tags } from "@/components/tags";
import { Translations } from "@/components/translations";
import { env } from "@/config/env.config";
import type { SocialMediaKind } from "@/lib/content/options";
import { getIntlLanguage } from "@/lib/i18n/locales";
import { createFullUrl } from "@/lib/navigation/create-full-url";

interface ResourceProps {
	attachments?: Array<{ label: string; file: string }>;
	authors: Array<{
		id: string;
		image: StaticImageData | string;
		name: string;
	}>;
	children: ReactNode;
	collection: string;
	href: string;
	endDate?: Date;
	featuredImage?: StaticImageData | string | null;
	id: string;
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

	const href = String(createFullUrl({ pathname: _href }));

	return (
		<article className="mx-auto w-full max-w-(--size-content) space-y-10">
			<header className="space-y-10">
				<PageTitle>{title}</PageTitle>
				<div className="space-y-6 border-y border-neutral-200 py-10 2xl:hidden">
					{location != null ? (
						<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
							<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">
								{t("location")}
							</div>
							<div>{location}</div>
						</div>
					) : null}
					{startDate ? (
						<div className="flex flex-col gap-y-2 text-sm text-neutral-500">
							<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">
								{t("date")}
							</div>
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
						className="mb-8 w-full overflow-hidden rounded-lg border border-neutral-200 object-cover"
						priority={true}
						sizes="720px"
						src={featuredImage}
					/>
				) : null}
				{children}
			</div>
			<footer className="pt-2">
				<SocialMediaShareLinks href={href} title={title} />
				<div className="flex justify-end text-right">
					<a
						className="inline-flex items-center gap-x-1.5 text-right text-sm text-brand-700 transition hover:text-brand-800 hover:underline focus:outline-none focus-visible:ring focus-visible:ring-brand-800"
						href={String(
							createUrl({
								baseUrl: env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL,
								pathname: `/keystatic/branch/main/collection/${encodeURIComponent(withI18nPrefix(collection, getIntlLanguage(locale)))}/item/${encodeURIComponent(id)}`,
							}),
						)}
						target="_blank"
					>
						<PencilIcon className="size-4 shrink-0" />
						<span className="text-right">{t("suggest-changes-to-resource")}</span>
					</a>
				</div>
			</footer>
		</article>
	);
}
