import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { FacebookIcon, TwitterIcon } from "@/app/(app)/_components/social-media-icons";
import { Link } from "@/components/link";

interface SocialMediaShareLinksProps {
	href: string;
	title: string;
}

export function SocialMediaShareLinks(props: SocialMediaShareLinksProps): ReactNode {
	const { href: url, title } = props;

	const t = useTranslations("SocialMediaShareLinks");
	const meta = useTranslations("metadata");

	const twitter = meta("twitter.site");

	return (
		<div className="my-8 flex items-center justify-center space-x-4 text-neutral-500">
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
