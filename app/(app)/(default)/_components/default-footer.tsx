import { useTranslations } from "next-intl";
import { type ComponentProps, type FC, type ReactNode, Suspense } from "react";

import { CopyrightNotice } from "@/app/(app)/(default)/_components/copyright-notice";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import {
	BlueskyIcon,
	EmailIcon,
	FacebookIcon,
	FlickrIcon,
	GitHubIcon,
	InstagramIcon,
	LinkedInIcon,
	MastodonIcon,
	OrcidIcon,
	RssIcon,
	TwitterIcon,
	WebsiteIcon,
	YouTubeIcon,
} from "@/components/social-media-icons";
import type { SocialMediaKind } from "@/lib/content/options";
import { useMetadata } from "@/lib/i18n/metadata";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationItem } from "@/lib/navigation/navigation";
import by from "@/public/assets/images/by.svg";
import cc from "@/public/assets/images/cc.svg";
import eu from "@/public/assets/images/logo-eu.svg";

const socialMediaIcons: Record<SocialMediaKind, FC<{ className?: string }>> = {
	bluesky: BlueskyIcon,
	email: EmailIcon,
	facebook: FacebookIcon,
	flickr: FlickrIcon,
	github: GitHubIcon,
	instagram: InstagramIcon,
	linkedin: LinkedInIcon,
	mastodon: MastodonIcon,
	orcid: OrcidIcon,
	rss: RssIcon,
	twitter: TwitterIcon,
	website: WebsiteIcon,
	youtube: YouTubeIcon,
};

interface DefaultFooterProps extends ComponentProps<"footer"> {}

export function DefaultFooter(props: Readonly<DefaultFooterProps>): ReactNode {
	const rest = props;

	const t = useTranslations("DefaultFooter");
	const meta = useMetadata();

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		},
		resources: {
			type: "link",
			href: createHref({ pathname: "/resources" }),
			label: t("navigation.items.resources"),
		},
		curricula: {
			type: "link",
			href: createHref({ pathname: "/curricula" }),
			label: t("navigation.items.curricula"),
		},
		search: {
			type: "link",
			href: createHref({ pathname: "/search" }),
			label: t("navigation.items.search"),
		},
		sources: {
			type: "link",
			href: createHref({ pathname: "/sources" }),
			label: t("navigation.items.sources"),
		},
		"course-registry": {
			type: "link",
			href: createHref({ pathname: "/course-registry" }),
			label: t("navigation.items.course-registry"),
		},
		documentation: {
			type: "link",
			href: createHref({ pathname: "/documentation" }),
			label: t("navigation.items.documentation"),
		},
		contact: {
			type: "link",
			href: "https://www.dariah.eu/helpdesk/",
			label: t("navigation.items.contact"),
		},
	} satisfies Record<string, NavigationItem>;

	return (
		<footer
			{...rest}
			className="flex flex-col gap-y-6 bg-brand-950 px-4 py-16 text-sm font-medium text-neutral-400 xs:px-8"
		>
			<nav aria-label={t("navigation.label")}>
				<ul
					className="flex flex-col items-center justify-center gap-y-3 md:flex-row md:gap-x-6 md:gap-y-0"
					role="list"
				>
					{Object.entries(navigation).map(([key, link]) => {
						return (
							<li key={key} className="inline-flex">
								<Link
									className="rounded p-2 text-center transition hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-neutral-400"
									href={link.href}
								>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<nav aria-label={t("navigation-social-media.label")} className="flex flex-col items-center">
				<ul className="flex items-center justify-center gap-x-2 md:gap-x-6" role="list">
					{Object.entries(meta.social).map(([_kind, href]) => {
						const kind = _kind as keyof typeof meta.social;
						const Icon = socialMediaIcons[kind];

						return (
							<li key={kind}>
								<a
									aria-label={t(`navigation-social-media.items.${kind}`)}
									className="inline-block rounded p-2 transition hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-neutral-400"
									href={href}
								>
									<Icon className="size-4" />
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-y-8 text-xs font-normal xs:flex-row xs:gap-x-8 xs:gap-y-0">
				<div className="flex items-center gap-x-4">
					<Image alt="" className="h-6 w-9 shrink-0" src={eu} />
					<span>{t("funding")}</span>
				</div>
				<div className="flex items-center justify-end gap-x-4">
					<span className="text-right">
						{t.rich("license", {
							link(chunks) {
								return (
									<a
										className="rounded transition hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-neutral-400"
										href="https://creativecommons.org/licenses/by/4.0/"
									>
										{chunks}
									</a>
								);
							},
						})}
					</span>
					<span className="flex shrink-0 items-center">
						<Image alt="" className="size-6 shrink-0" src={cc} />
						<Image alt="" className="size-6 shrink-0" src={by} />
					</span>
				</div>
			</div>
			<small className="text-center">
				<Suspense>
					<CopyrightNotice />
				</Suspense>
				<span> &bull; </span>
				<Link
					className="rounded transition hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-neutral-400"
					href={createHref({ pathname: "/imprint" })}
				>
					{t("navigation.items.imprint")}
				</Link>
			</small>
		</footer>
	);
}
