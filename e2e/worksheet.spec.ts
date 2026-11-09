import { readFile } from "node:fs/promises";

import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The worksheet is not used by any published content, so it is driven through the fixture resource in
 * `e2e/fixtures/resources/`, which `pnpm run e2e:fixtures:create` copies into the content collection before the build.
 * It is real content, compiled by the same pipeline as everything else, and gitignored, so no deployment has it.
 */
const pathname = "/resources/hosted/e2e-content-widgets";

/**
 * Answers are typed rather than filled: `locator.fill()` sets the value without the key events react needs, and webkit
 * then resets the controlled field to its previous value.
 */
const answerText = "Interview transcripts";

/** Answers are scoped to the page and to the worksheet title, so two worksheets on one page do not collide. */
function createStorageKey(title: string): string {
	return ["dariah-campus", "worksheet", pathname, title].join(":");
}

function getWorksheet(page: Page, title: string): Locator {
	return page.getByRole("region", { name: title });
}

function getProgress(worksheet: Locator): Locator {
	return worksheet.getByRole("progressbar", { name: "Form progress" });
}

function readStoredAnswers(page: Page, title: string): Promise<string | null> {
	return page.evaluate((key) => window.localStorage.getItem(key), createStorageKey(title));
}

test.describe("worksheet", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("renders a step per section, plus the summary", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");
		const progress = getProgress(worksheet);

		await expect(progress).toContainText("Step 1 of 3");
		await expect(progress).toContainText("Data collection");

		const first = worksheet.getByRole("group", { name: "Data collection" });
		await expect(first).toBeVisible();
		await expect(first.getByRole("textbox", { name: "Which data will you collect?" })).toBeVisible();
		await expect(first.getByRole("textbox", { name: "Who owns the data?" })).toBeVisible();

		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();

		await expect(progress).toContainText("Step 2 of 3");
		await expect(worksheet.getByRole("group", { name: "Data sharing" })).toBeVisible();

		await worksheet.getByRole("button", { name: "Review answers" }).click();

		await expect(progress).toContainText("Step 3 of 3");
		await expect(progress).toContainText("Summary");
		await expect(worksheet.getByRole("group", { name: "Summary" })).toBeVisible();
	});

	test("keeps rich text in the description", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");

		const link = worksheet.getByRole("link", { name: "DARIAH website" });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute("href", "https://www.dariah.eu");

		await expect(worksheet.getByText("more guidance")).toBeVisible();
		await expect(worksheet.getByRole("listitem")).toHaveCount(2);
	});

	/** The cms saves entries even when a required field was left empty. */
	test("drops questions without a prompt and sections without questions", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Worksheet");

		await expect(getProgress(worksheet)).toContainText("Step 1 of 3");

		const first = worksheet.getByRole("group", { name: "Section 1" });
		await expect(first.getByRole("textbox")).toHaveCount(1);
		await expect(first.getByRole("textbox", { name: "Which sources did you consult?" })).toBeVisible();

		await expect(page.getByText("Discarded section")).toHaveCount(0);
	});

	test("falls back to generated titles", async ({ page }) => {
		await page.goto(pathname);

		/** A missing worksheet title used to throw on download, so the fallback has to reach the document too. */
		const worksheet = getWorksheet(page, "Worksheet");
		const progress = getProgress(worksheet);

		await expect(worksheet).toBeVisible();
		await expect(progress).toContainText("Section 1");
		await expect(worksheet.getByRole("group", { name: "Section 1" })).toBeVisible();

		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();

		await expect(progress).toContainText("Section 2");
		await expect(worksheet.getByRole("group", { name: "Section 2" })).toBeVisible();

		await worksheet.getByRole("button", { name: "Review answers" }).click();

		const summary = worksheet.getByRole("group", { name: "Summary" });
		await expect(summary.getByText("Section 1")).toBeVisible();
		await expect(summary.getByText("Section 2")).toBeVisible();

		const download = page.waitForEvent("download");
		await worksheet.getByRole("button", { name: "Download document" }).click();
		const file = await download;

		expect(file.suggestedFilename()).toBe("worksheet.doc");

		const content = await readFile(await file.path(), "utf-8");
		expect(content).toContain("Section 1");
		expect(content).toContain("Section 2");
	});

	test("keeps answers across a reload, and clears them on request", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");
		const answer = worksheet.getByRole("textbox", { name: "Which data will you collect?" });

		await answer.pressSequentially(answerText);

		await expect.poll(() => readStoredAnswers(page, "Research data plan")).toContain(answerText);

		await page.reload();

		await expect(answer).toHaveValue(answerText);

		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();
		await worksheet.getByRole("button", { name: "Review answers" }).click();
		await worksheet.getByRole("button", { name: "Clear answers" }).click();
		await worksheet.getByRole("button", { name: "Confirm clearing answers" }).click();

		await expect.poll(() => readStoredAnswers(page, "Research data plan")).toBeNull();

		await expect(answer).toHaveValue("");
	});

	test("downloads the answers as a document", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");

		await worksheet.getByRole("textbox", { name: "Which data will you collect?" }).pressSequentially(answerText);
		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();
		await worksheet.getByRole("button", { name: "Review answers" }).click();

		const download = page.waitForEvent("download");
		await worksheet.getByRole("button", { name: "Download document" }).click();
		const file = await download;

		expect(file.suggestedFilename()).toBe("research-data-plan.doc");

		const content = await readFile(await file.path(), "utf-8");
		expect(content).toContain("Research data plan");
		expect(content).toContain("Data collection");
		expect(content).toContain(answerText);
		/** Unanswered questions are labelled instead of being left blank. */
		expect(content).toContain("Not answered");
	});

	test("prints the document from a hidden iframe", async ({ page }) => {
		/** Runs in every frame, including the srcdoc iframe, so no real print dialog ever opens. */
		await page.addInitScript(() => {
			window.print = () => {
				/** Intentionally empty. */
			};
		});

		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");

		await worksheet.getByRole("textbox", { name: "Which data will you collect?" }).pressSequentially(answerText);
		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();
		await worksheet.getByRole("button", { name: "Review answers" }).click();
		await worksheet.getByRole("button", { name: "Print or save as PDF" }).click();

		await expect
			.poll(() =>
				page.evaluate(() => document.querySelector('iframe[title="Research data plan"]')?.getAttribute("srcdoc")),
			)
			.toContain(answerText);
	});

	test("does not move focus on load", async ({ page }) => {
		await page.goto(pathname);

		await expect(getWorksheet(page, "Research data plan")).toBeVisible();

		/**
		 * Hydration is what would steal focus, and a negative assertion passes immediately, so this needs a window in which
		 * the effect could have run.
		 */
		// oxlint-disable-next-line playwright/no-wait-for-timeout -- asserting that nothing happens.
		await page.waitForTimeout(1000);

		expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("BODY");
	});

	test("moves focus to the new step when navigating", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");
		const second = worksheet.getByRole("group", { name: "Data sharing" });
		const summary = worksheet.getByRole("group", { name: "Summary" });

		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();
		await expect(second).toBeFocused();

		await worksheet.getByRole("button", { name: "Review answers" }).click();
		await expect(summary).toBeFocused();

		await worksheet.getByRole("button", { exact: true, name: "Back" }).click();
		await expect(second).toBeFocused();

		await worksheet.getByRole("button", { name: "Review answers" }).click();
		await worksheet.getByRole("button", { name: "Clear answers" }).click();
		await worksheet.getByRole("button", { name: "Confirm clearing answers" }).click();

		await expect(worksheet.getByRole("group", { name: "Data collection" })).toBeFocused();
	});

	/**
	 * Boundary controls are `aria-disabled`, not `disabled`, so they stay focusable - see
	 * `components/content/image-layers.tsx`. Swapping in a real `disabled` attribute drops focus to `<body>`.
	 */
	test("keeps the boundary control focusable but inert", async ({ page }) => {
		await page.goto(pathname);

		const worksheet = getWorksheet(page, "Research data plan");
		const previous = worksheet.getByRole("button", { exact: true, name: "Back" });

		await expect(previous).toHaveAttribute("aria-disabled", "true");
		await expect(previous).toHaveJSProperty("disabled", false);
		await expect(previous).toHaveJSProperty("tabIndex", 0);

		await previous.focus();
		await expect(previous).toBeFocused();

		await previous.press("Enter");

		await expect(getProgress(worksheet)).toContainText("Step 1 of 3");
		await expect(previous).toBeFocused();
	});

	/** Content widgets must not emit headings, so they stay out of the table of contents. */
	test("does not emit headings", async ({ page }) => {
		await page.goto(pathname);

		await expect(getWorksheet(page, "Research data plan").getByRole("heading")).toHaveCount(0);
	});
});
