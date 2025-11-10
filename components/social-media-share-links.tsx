import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import {
	BlueskyIcon,
	FacebookIcon,
	LinkedInIcon,
	TwitterIcon,
} from "@/components/social-media-icons";
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

	const links = {
		bluesky: {
			href: createUrl({
				baseUrl: "https://bsky.app",
				pathname: "/intent/compose",
				searchParams: createUrlSearchParams({
					text: [title, url].join(" "),
				}),
			}),
			icon: <BlueskyIcon />,
			label: t("share-link", { platform: "Bluesky" }),
		},
		facebook: {
			href: createUrl({
				baseUrl: "https://www.facebook.com",
				pathname: "/sharer/sharer.php",
				searchParams: createUrlSearchParams({
					u: url,
					title: title,
				}),
			}),
			icon: <FacebookIcon />,
			label: t("share-link", { platform: "Facebook" }),
		},
		linkedin: {
			href: createUrl({
				baseUrl: "https://www.linkedin.com",
				pathname: "/shareArticle/",
				searchParams: createUrlSearchParams({
					mini: "true",
					url,
				}),
			}),
			icon: <LinkedInIcon />,
			label: t("share-link", { platform: "LinkedIn" }),
		},
		twitter: {
			href: createUrl({
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
			icon: <TwitterIcon />,
			label: t("share-link", { platform: "Twitter" }),
		},
	};

	return (
		<div className="my-8 flex items-center justify-center gap-x-4 text-neutral-500">
			{Object.entries(links).map(([id, link]) => {
				return (
					<Link
						key={id}
						className="block rounded-full transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
						href={String(link.href)}
					>
						{link.icon}
						<span className="sr-only">{link.label}</span>
					</Link>
				);
			})}
		</div>
	);
}
