import type metadata from "@/content/en/metadata/index.json";
import { getIntlLanguage, type IntlLocale } from "@/lib/i18n/locales";
import type messages from "@/messages/en.json";

type Messages = typeof messages;
type Metadata = typeof metadata;
type SocialMediaKind = Metadata["social"][number]["kind"];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getIntlMessages(locale: IntlLocale) {
	const language = getIntlLanguage(locale);

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

export type IntlMessages = Awaited<ReturnType<typeof getIntlMessages>>;
