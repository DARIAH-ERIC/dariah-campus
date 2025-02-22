import type { Page } from "@playwright/test";
import { createFormatter, createTranslator } from "next-intl";

import { defaultLocale, type IntlMessages, type Locale } from "@/config/i18n.config";
import type metadata from "@/content/en/metadata/index.json";
import { getLanguage } from "@/lib/i18n/get-language";
import type messages from "@/messages/en.json";

export interface I18n {
	t: ReturnType<typeof createTranslator<IntlMessages>>;
	format: ReturnType<typeof createFormatter>;
	messages: IntlMessages;
}

export async function createI18n(_page: Page, locale = defaultLocale): Promise<I18n> {
	const messages = await getI18nMessages(locale);

	return {
		t: createTranslator({ locale, messages }),
		format: createFormatter({ locale }),
		messages,
	};
}

export type WithI18n<T> = T & { i18n: I18n };

/**
 * Copied from `@/lib/i18n/get-messages.ts` because playwright needs import attributes
 * for json imports.
 */

type Messages = typeof messages;
type Metadata = typeof metadata;
type SocialMediaKind = Metadata["social"][number]["kind"];

async function getI18nMessages(locale: Locale) {
	const language = getLanguage(locale);

	const { default: _messages } = (await import(`@/messages/${language}.json`, {
		with: { type: "json" },
	})) as { default: Messages };
	const { default: _metadata } = (await import(`@/content/${language}/metadata/index.json`, {
		with: { type: "json" },
	})) as { default: Metadata };

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
