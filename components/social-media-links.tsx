import type { FC, ReactNode } from "react";

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
} from "#/components/social-media-icons.tsx";
import type { SocialMediaKind } from "#/lib/content/options.ts";

const logos: Record<SocialMediaKind, FC<{ className?: string }>> = {
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

interface SocialMediaLinksProps {
	social: ReadonlyArray<{ discriminant: SocialMediaKind; value: string }>;
}

/** Inline-level, so it can be centered with `text-center` on an ancestor. */
export function SocialMediaLinks(props: Readonly<SocialMediaLinksProps>): ReactNode {
	const { social } = props;

	return (
		<ul className="inline-flex gap-x-4">
			{social.map((link, index) => {
				const { discriminant, value } = link;

				const Logo = logos[discriminant];

				return (
					<li key={index} className="list-none">
						<a
							className="transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
							/** Email addresses are stored without a scheme. */
							href={discriminant === "email" ? `mailto:${value}` : value}
						>
							<Logo aria-hidden={true} className="inline text-neutral-500 block-5 inline-5" />
							<span className="sr-only">{discriminant}</span>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
