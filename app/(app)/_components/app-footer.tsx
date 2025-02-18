// eslint-disable-next-line no-restricted-imports
import type { StaticImageData } from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { FC, ReactNode } from "react";

import {
	BlueskyIcon,
	EmailIcon,
	FacebookIcon,
	FlickrIcon,
	GitHubIcon,
	LinkedInIcon,
	MastodonIcon,
	OrcidIcon,
	RssIcon,
	TwitterIcon,
	WebsiteIcon,
	YouTubeIcon,
} from "@/app/(app)/_components/social-media-icons";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { createClient } from "@/lib/content/create-client";
import type { SocialMediaKind } from "@/lib/content/options";
import { createHref } from "@/lib/create-href";
import by from "@/public/assets/images/by.svg";
import cc from "@/public/assets/images/cc.svg";
import eu from "@/public/assets/images/logo-eu.svg";

const socialMediaIcons: Record<SocialMediaKind, FC<{ className?: string }>> = {
	bluesky: BlueskyIcon,
	email: EmailIcon,
	facebook: FacebookIcon,
	flickr: FlickrIcon,
	github: GitHubIcon,
	linkedin: LinkedInIcon,
	mastodon: MastodonIcon,
	orcid: OrcidIcon,
	rss: RssIcon,
	twitter: TwitterIcon,
	website: WebsiteIcon,
	youtube: YouTubeIcon,
};

export async function AppFooter(): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("AppFooter");

	const navigation = {
		home: {
			href: createHref({ pathname: "/" }),
			label: t("links.home"),
		},
		resources: {
			href: createHref({ pathname: "/resources" }),
			label: t("links.resources"),
		},
		curricula: {
			href: createHref({ pathname: "/curricula" }),
			label: t("links.curricula"),
		},
		search: {
			href: createHref({ pathname: "/search" }),
			label: t("links.search"),
		},
		sources: {
			href: createHref({ pathname: "/sources" }),
			label: t("links.sources"),
		},
		"course-registry": {
			href: createHref({ pathname: "/course-registry" }),
			label: t("links.course-registry"),
		},
		documentation: {
			href: createHref({ pathname: "/documentation" }),
			label: t("links.documentation"),
		},
		contact: {
			href: "https://www.dariah.eu/helpdesk/",
			label: t("links.contact"),
		},
	};

	const client = await createClient(locale);
	const metadata = await client.metadata.get();
	const { social } = metadata.data;

	return (
		<footer className="flex flex-col space-y-6 bg-brand-950 px-4 py-16 text-sm font-medium text-neutral-400 xs:px-8">
			<nav aria-label={t("navigation-secondary")}>
				<ul
					className="flex flex-col items-center justify-center space-y-3 md:flex-row md:space-x-6 md:space-y-0"
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
			<nav aria-label={t("navigation-social-media")} className="flex flex-col items-center">
				<ul className="flex items-center justify-center space-x-2 md:space-x-6" role="list">
					{social.map((link, index) => {
						const Icon = socialMediaIcons[link.kind];

						return (
							<li key={index}>
								<a
									aria-label={link.kind}
									className="inline-block rounded p-2 transition hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-neutral-400"
									href={link.href!}
								>
									<Icon className="size-4" />
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="mx-auto flex max-w-screen-lg flex-col items-center justify-between space-y-8 text-xs font-normal xs:flex-row xs:space-x-8 xs:space-y-0">
				<div className="flex items-center space-x-4">
					<Image alt="" className="h-6 w-9 shrink-0" src={eu as StaticImageData} />
					<span>{t("funding")}</span>
				</div>
				<div className="flex items-center justify-end space-x-4">
					<span className="text-right">
						{t.rich("license", {
							// eslint-disable-next-line react/no-unstable-nested-components
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
						<Image alt="" className="size-6 shrink-0" src={cc as StaticImageData} />
						<Image alt="" className="size-6 shrink-0" src={by as StaticImageData} />
					</span>
				</div>
			</div>
			<small className="text-center">
				{/* eslint-disable-next-line react/jsx-no-literals */}
				{new Date().getUTCFullYear()} DARIAH &bull;{" "}
				<Link
					className="rounded transition hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-neutral-400"
					href={createHref({ pathname: "/imprint" })}
				>
					{t("links.imprint")}
				</Link>
			</small>
		</footer>
	);
}
