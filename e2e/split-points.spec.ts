import { expect, test } from "@playwright/test";

/**
 * No published resource uses split points yet, so everything here runs against the fixture resource - see
 * `e2e/fixtures/resources/`.
 */
const pathname = "/resources/hosted/e2e-split-points";

test.describe("split points", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The split point fixture is not part of a deployed app.",
		);
	});

	test("displays the first section by default", async ({ page }) => {
		await page.goto(pathname);

		await expect(page.getByRole("heading", { name: "Before the first split" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "The middle section" })).toBeHidden();
		await expect(page.getByRole("navigation", { name: "Sections" })).toContainText("Section 1 of 3");
	});

	test("displays the section named by the search param", async ({ page }) => {
		await page.goto(`${pathname}?section=last`);

		await expect(page.getByRole("heading", { name: "The last section" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Before the first split" })).toBeHidden();
		await expect(page.getByRole("navigation", { name: "Sections" })).toContainText("Section 3 of 3");
	});

	test("falls back to the first section for an unknown section", async ({ page }) => {
		await page.goto(`${pathname}?section=does-not-exist`);

		await expect(page.getByRole("heading", { name: "Before the first split" })).toBeVisible();
	});

	test("moves between sections", async ({ page }) => {
		await page.goto(pathname);

		const navigation = page.getByRole("navigation", { name: "Sections" });

		await navigation.getByRole("link", { name: /Next/ }).click();

		await expect(page).toHaveURL(`${pathname}?section=middle`);
		await expect(page.getByRole("heading", { name: "The middle section" })).toBeVisible();

		await navigation.getByRole("link", { name: /Previous/ }).click();

		await expect(page).toHaveURL(`${pathname}?section=section-1`);
		await expect(page.getByRole("heading", { name: "Before the first split" })).toBeVisible();
	});

	test("omits the boundary control in the first and last section", async ({ page }) => {
		await page.goto(pathname);

		const navigation = page.getByRole("navigation", { name: "Sections" });
		await expect(navigation.getByRole("link", { name: /Previous/ })).toBeHidden();

		await page.goto(`${pathname}?section=last`);
		await expect(navigation.getByRole("link", { name: /Next/ })).toBeHidden();
	});

	/** The table of contents covers the whole resource, so its entries have to switch sections as well. */
	test("links table of contents entries to the section they live in", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });

		await page.goto(pathname);

		const tableOfContents = page.getByRole("navigation", { name: "Table of contents" });

		await expect(tableOfContents.getByRole("link", { name: "Before the first split" })).toHaveAttribute(
			"href",
			"#before-the-first-split",
		);
		await expect(tableOfContents.getByRole("link", { name: "A nested heading" })).toHaveAttribute(
			"href",
			"?section=middle#a-nested-heading",
		);

		await tableOfContents.getByRole("link", { name: "The last section" }).click();

		await expect(page).toHaveURL(`${pathname}?section=last#the-last-section`);
		await expect(page.getByRole("heading", { name: "The last section" })).toBeVisible();
	});
});
