import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { FacebookIcon, TwitterIcon } from "@/components/social-media-icons";
import { useMetadata } from "@/lib/i18n/metadata";

interface SocialMediaShareLinksProps {
	href: string;
	title: string;
}

export function SocialMediaShareLinks(props: Readonly<SocialMediaShareLinksProps>): ReactNode {
	const { href: url, title } = props;

	const t = useTranslations("SocialMediaShareLinks");
	const meta = useMetadata();

	const twitter = meta.social.twitter;

	return (
		<div className="my-8 flex items-center justify-center gap-x-4 text-neutral-500">
			<Link
				className="block rounded-full transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
				href={String(
					createUrl({
						baseUrl: "https://www.twitter.com",
						pathname: "/intent/tweet",
						searchParams: createUrlSearchParams({
							text: title,
							url,
							via: twitter,
							related: String(
								createUrl({
									baseUrl: "https://www.twitter.com",
									pathname: twitter,
								}),
							),
						}),
					}),
				)}
			>
				<TwitterIcon />
				<span className="sr-only">{t("share-link", { platform: "Twitter" })}</span>
			</Link>
			<Link
				className="block rounded-full transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
				href={String(
					createUrl({
						baseUrl: "https://www.facebook.com",
						pathname: "/sharer/sharer.php",
						searchParams: createUrlSearchParams({
							u: url,
							title: title,
						}),
					}),
				)}
			>
				<FacebookIcon />
				<span className="sr-only">{t("share-link", { platform: "Facebook" })}</span>
			</Link>
		</div>
	);
}
