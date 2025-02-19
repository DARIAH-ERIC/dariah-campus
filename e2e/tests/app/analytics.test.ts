import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { defaultLocale } from "@/config/i18n.config";
import { expect, test } from "@/e2e/lib/test";

test.describe("analytics service", () => {
	// eslint-disable-next-line playwright/no-skipped-test
	test.skip(() => {
		return env.NEXT_PUBLIC_MATOMO_BASE_URL == null || env.NEXT_PUBLIC_MATOMO_ID == null;
	}, "Analytics service disabled.");

	const baseUrl = String(
		createUrl({ baseUrl: env.NEXT_PUBLIC_MATOMO_BASE_URL!, pathname: "/matomo.php?**" }),
	);

	test("should track page views", async ({ createIndexPage }) => {
		const { indexPage, i18n } = await createIndexPage(defaultLocale);
		const { page } = indexPage;

		const initialResponsePromise = page.waitForResponse(baseUrl);
		await indexPage.goto();
		const initialResponse = await initialResponsePromise;
		expect(initialResponse.status()).toBe(204);

		const responsePromise = page.waitForResponse(baseUrl);
		await page.getByRole("link", { name: i18n.t("AppFooter.links.imprint") }).click();
		const response = await responsePromise;
		expect(response.status()).toBe(204);
	});
});
