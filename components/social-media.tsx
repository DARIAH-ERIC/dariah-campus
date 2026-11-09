import type { ReactNode } from "react";

import { SocialMediaLinks } from "#/components/social-media-links.tsx";
import type { SocialMediaKind } from "#/lib/content/options.ts";

interface SocialMediaProps {
	label: string;
	social: ReadonlyArray<{ discriminant: SocialMediaKind; value: string }>;
}

export function SocialMedia(props: Readonly<SocialMediaProps>): ReactNode {
	const { label, social } = props;

	if (social.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-1.5 text-sm text-neutral-500">
			<div className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{label}</div>
			<div>
				<SocialMediaLinks social={social} />
			</div>
		</div>
	);
}
