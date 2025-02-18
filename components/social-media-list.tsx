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
import type { SocialMediaKind } from "@/lib/content/options";

const logos: Record<SocialMediaKind, FC<{ className?: string }>> = {
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

interface SocialMediaListProps {
	label: ReactNode;
	social: ReadonlyArray<{ discriminant: SocialMediaKind; value: string }>;
}

export function SocialMediaList(props: SocialMediaListProps): ReactNode {
	const { label, social } = props;

	if (social.length === 0) return null;

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</div>
			<div>
				<ul className="inline-flex gap-x-4">
					{social.map((link, index) => {
						const { discriminant, value } = link;

						const Logo = logos[discriminant];

						return (
							<li key={index} className="list-none">
								<a
									className="transition hover:to-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={value}
								>
									<Logo aria-hidden={true} className="inline size-5 text-neutral-500" />
									<span className="sr-only">{discriminant}</span>
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
