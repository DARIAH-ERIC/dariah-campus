import type { Locale } from "@/config/i18n.config";
import type metadata from "@/content/en/metadata/index.json";
import { getLanguage } from "@/lib/i18n/get-language";
import type messages from "@/messages/en.json";

type Messages = typeof messages;
type Metadata = typeof metadata;
type SocialMediaKind = Metadata["social"][number]["kind"];

export async function getI18nMessages(locale: Locale) {
	const language = getLanguage(locale);

	const _messages = (await import(`@/messages/${language}.json`)) as Messages;
	const _metadata = (await import(`@/content/${language}/metadata/index.json`)) as Metadata;

	const _social: Record<string, string> = {};

	_metadata.social.forEach((entry) => {
		_social[entry.kind] = entry.href;
	});

	const messages = {
		..._messages,
		metadata: {
			..._metadata,
			social: _social as Record<SocialMediaKind, string>,
		},
	};

	return messages;
}

export type I18nMessages = Awaited<ReturnType<typeof getI18nMessages>>;
