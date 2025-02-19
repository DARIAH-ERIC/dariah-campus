import type { Locale } from "next-intl";
import { getMessages } from "next-intl/server";

import type { SocialMediaKind } from "@/lib/content/options";

export async function getMetadata(locale?: Locale) {
	const messages = await getMessages({ locale });

	const metadata = messages.metadata;

	const _social: Record<string, string> = {};
	(messages.metadata.social as Array<{ kind: SocialMediaKind; href: string }>).forEach((entry) => {
		_social[entry.kind] = entry.href;
	});
	const social = _social as Record<SocialMediaKind, string>;

	return { ...metadata, social };
}
