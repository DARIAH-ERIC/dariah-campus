import { expect, test } from "@playwright/test";
import { getViolations, injectAxe } from "axe-playwright";

/**
 * Scoped to the rendered content of the fixture resource, so the scan reports what the content components produce, and
 * not pre-existing issues in the surrounding page chrome - a resource page has a `link-in-text-block` violation in its
 * re-use conditions, which is nothing to do with the widgets.
 */
const pathname = "/resources/hosted/e2e-content-widgets";

/** The rendered mdx content, which is exactly the widgets and nothing else on the page. */
const selector = ".prose";

/**
 * Overlays are portalled to the end of the document, so they sit outside the scan above and need one of their own. The
 * popover around them holds no content, which leaves the menu itself as the thing worth scanning.
 */
const menuSelector = '[role="menu"]';

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Asserted as a list rather than a count, so a new violation names itself in the failure message. */
const knownViolations: Array<string> = [];

function getViolationIds(violations: Awaited<ReturnType<typeof getViolations>>): Array<string> {
	return violations.map((violation) => violation.id);
}

function formatViolations(violations: Awaited<ReturnType<typeof getViolations>>): Array<string> {
	return violations.map(
		(violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
	);
}

test.describe("accessibility", () => {
	test.beforeEach(async ({ page }) => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);

		await page.goto(pathname);
		await injectAxe(page);
	});

	test("has no violations in the initial state", async ({ page }) => {
		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/** The error state adds `aria-invalid`, a live region and an `aria-describedby` reference. */
	test("has no violations after an incorrect answer", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("checkbox", { name: "Markdown" }),
		});

		await quiz.getByRole("checkbox", { name: "Markdown" }).check();
		await quiz.getByRole("button", { name: "Check answer" }).click();

		await expect(quiz.getByRole("checkbox", { name: "Markdown" })).toHaveAttribute("aria-invalid", "true");

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/**
	 * Image drop zones is the widget with the most states to get wrong: items move between the bank and the zones, the
	 * placed ones grow a correct/incorrect mark, and the bank keeps the moved ones as `aria-hidden` placeholders.
	 */
	test("has no violations with items placed and checked", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("group", { name: "Nave" }),
		});

		await quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Nave" }).click();
		await quiz.getByRole("button", { name: "Semicircular recess. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Nave" }).click();

		await quiz.getByRole("button", { exact: true, name: "Check" }).click();

		await expect(quiz.getByRole("button", { name: "Long central hall, in Nave. Correct. Remove." })).toBeVisible();
		await expect(quiz.getByRole("button", { name: "Semicircular recess, in Nave. Incorrect. Remove." })).toBeVisible();

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/** The solved state disables every item and hides the whole bank from assistive technology. */
	test("has no violations on the image drop zones solution", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("group", { name: "Nave" }),
		});

		await quiz.getByRole("button", { name: "Show solution" }).click();

		await expect(quiz.getByRole("button", { name: "Long central hall, in Nave." })).toBeDisabled();

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/** Every item offers its drop zones through a menu, which is the path keyboard and touch users take. */
	test("has no violations in an open item menu", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("group", { name: "Nave" }),
		});

		await quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." }).click();

		await expect(page.getByRole("menu", { name: "Long central hall. Choose a drop zone." })).toBeVisible();

		const violations = await getViolations(page, menuSelector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/** Placing a word empties its slot in the bank, and checking marks every blank right or wrong. */
	test("has no violations with words placed and checked", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("list", { name: "Answers" }),
		});

		await quiz.getByRole("button", { name: "Blank 1. Select a word." }).click();
		await page.getByRole("menuitem", { name: "push" }).click();
		await quiz.getByRole("button", { name: "Blank 2. Select a word." }).click();
		await page.getByRole("menuitem", { name: "merge" }).click();

		await quiz.getByRole("button", { exact: true, name: "Check" }).click();

		await expect(quiz.getByText("1 / 2 correct")).toBeVisible();

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/** The blanks grow `aria-invalid` and a description, and the solution replaces them with the answers. */
	test("has no violations on a checked fill in the blank", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("textbox", { name: "Blank 1" }),
		});

		await quiz.getByRole("textbox", { name: "Blank 1" }).fill("stage");
		await quiz.getByRole("button", { exact: true, name: "Check" }).click();

		await expect(quiz.getByRole("textbox", { name: "Blank 1" })).toHaveAttribute("aria-invalid", "true");

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	/** The inline presentation moves the annotation into a panel beside the image. */
	test("has no violations with an image hotspot open", async ({ page }) => {
		const quiz = page.getByRole("complementary").filter({
			has: page.getByRole("img", { name: "An annotated plan" }),
		});

		await quiz.getByRole("button", { exact: true, name: "Nave" }).click();

		await expect(quiz.getByText("The central aisle of the building.")).toBeVisible();

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});

	test("has no violations on the worksheet summary", async ({ page }) => {
		const worksheet = page.getByRole("region", { name: "Research data plan" });

		await worksheet.getByRole("button", { exact: true, name: "Next" }).click();
		await worksheet.getByRole("button", { name: "Review answers" }).click();

		await expect(worksheet.getByRole("group", { name: "Summary" })).toBeVisible();

		const violations = await getViolations(page, selector, { runOnly: { type: "tag", values: tags } });

		expect(getViolationIds(violations), formatViolations(violations).join("\n")).toStrictEqual(knownViolations);
	});
});
