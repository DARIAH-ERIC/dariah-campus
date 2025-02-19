import type { Locator, Page } from "@playwright/test";

import { defaultLocale, type Locale } from "@/config/i18n.config";
import type { I18n } from "@/e2e/lib/fixtures/i18n";

export class ImprintPage {
	readonly page: Page;
	readonly locale: Locale;
	readonly i18n: I18n;
	readonly url: string;
	readonly mainContent: Locator;
	readonly title: Locator;
	readonly skipLink: Locator;

	constructor(page: Page, locale = defaultLocale, i18n: I18n) {
		this.page = page;
		this.locale = locale;
		this.i18n = i18n;
		this.url = "/imprint";
		this.mainContent = page.getByRole("main");
		this.title = page.getByRole("heading", { level: 1 });
		this.skipLink = page.getByRole("link", { name: i18n.t("LocaleLayout.skip-to-main-content") });
	}

	goto() {
		return this.page.goto(this.url);
	}
}
