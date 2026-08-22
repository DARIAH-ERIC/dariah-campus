import { type Locator, type Page, expect, test } from "@playwright/test";

import { focusStably } from "#/e2e/utils.ts";

/**
 * `/resources/hosted/git-collaboration` has a single `Quiz` with two paginated `QuizChoice` pages, both
 * `variant="multiple"`, and provides its own success and error messages ("Correct!" / "Try again").
 */
const pathname = "/resources/hosted/git-collaboration";

/** Six single choice pages, and a fill in the blank passage which is the only one on the page. */
const variantsPathname = "/resources/hosted/introduction-to-the-european-collaborative-cloud-for-cultural-heritage";

/**
 * The fixture resource in `e2e/fixtures/resources/`, copied into the content collection by `pnpm run
 * e2e:fixtures:create` before the build, and gitignored, so no deployment has it.
 */
const fixturePathname = "/resources/hosted/e2e-content-widgets";

const total = 2;

function getQuestion(page: Page, index: number): Locator {
	return page.getByRole("group", { name: `Question ${String(index)} of ${String(total)}` });
}

test.describe("quiz", () => {
	/**
	 * The regression from #1839: adding `"use client"` to `components/content/quiz-choice.tsx` made `getChildrenByType`
	 * match nothing, so questions and answers came back empty and only the chrome rendered. Types, lint and the build all
	 * stayed green.
	 */
	test("renders questions and answer options", async ({ page }) => {
		await page.goto(pathname);

		const question = getQuestion(page, 1);
		await expect(question).toBeVisible();

		await expect(question.getByText("What are GitHub, GitLab and Bitbucket?")).toBeVisible();

		await expect(question.getByRole("checkbox")).toHaveCount(3);
		await expect(question.getByRole("checkbox", { name: "Version control systems" })).toBeVisible();
		await expect(question.getByRole("checkbox", { name: "hosting providers" })).toBeVisible();
		await expect(question.getByRole("checkbox", { name: "code editors" })).toBeVisible();

		await expect(question.getByRole("button", { name: "Check answer" })).toBeVisible();
	});

	test("reports an incorrect answer", async ({ page }) => {
		await page.goto(pathname);

		const question = getQuestion(page, 1);
		const incorrect = question.getByRole("checkbox", { name: "Version control systems" });
		const correct = question.getByRole("checkbox", { name: "hosting providers" });
		const unrelated = question.getByRole("checkbox", { name: "code editors" });

		await incorrect.check();
		await question.getByRole("button", { name: "Check answer" }).click();

		await expect(question.getByText("Try again")).toBeVisible();

		/** Both the wrongly checked and the wrongly unchecked answer are marked. */
		await expect(incorrect).toHaveAttribute("aria-invalid", "true");
		await expect(correct).toHaveAttribute("aria-invalid", "true");
		await expect(unrelated).not.toHaveAttribute("aria-invalid", "true");
	});

	test("reports a correct answer", async ({ page }) => {
		await page.goto(pathname);

		const question = getQuestion(page, 1);
		const correct = question.getByRole("checkbox", { name: "hosting providers" });

		/** Answering incorrectly first, so the success state has to actively clear `aria-invalid`. */
		await question.getByRole("checkbox", { name: "code editors" }).check();
		await question.getByRole("button", { name: "Check answer" }).click();
		await expect(question.getByText("Try again")).toBeVisible();

		await question.getByRole("checkbox", { name: "code editors" }).uncheck();
		await correct.check();
		await question.getByRole("button", { name: "Check answer" }).click();

		await expect(question.getByText("Correct!")).toBeVisible();
		await expect(question.getByText("Try again")).toBeHidden();

		for (const checkbox of await question.getByRole("checkbox").all()) {
			await expect(checkbox).not.toHaveAttribute("aria-invalid", "true");
		}
	});

	test("does not move focus on load", async ({ page }) => {
		await page.goto(pathname);

		await expect(getQuestion(page, 1)).toBeVisible();

		/**
		 * Hydration is what would steal focus, and a negative assertion passes immediately, so this needs a window in which
		 * the effect could have run.
		 */
		// oxlint-disable-next-line playwright/no-wait-for-timeout -- asserting that nothing happens.
		await page.waitForTimeout(1000);

		expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("BODY");
		await expect(getQuestion(page, 1)).not.toBeFocused();
	});

	test("moves focus to the question when navigating", async ({ page }) => {
		await page.goto(pathname);

		const first = getQuestion(page, 1);
		const second = getQuestion(page, 2);

		await first.getByRole("button", { name: "Next question" }).click();

		await expect(second).toBeVisible();
		await expect(first).toBeHidden();
		await expect(second).toBeFocused();

		await expect(second.getByText("What is the difference between")).toBeVisible();

		await second.getByRole("button", { name: "Previous question" }).click();

		await expect(first).toBeVisible();
		await expect(second).toBeHidden();
		await expect(first).toBeFocused();
	});

	/**
	 * Boundary controls are `aria-disabled`, not `disabled`, so they stay focusable - see
	 * `components/content/image-layers.tsx`. Swapping in a real `disabled` attribute drops focus to `<body>`.
	 */
	test("keeps boundary controls focusable but inert", async ({ page }) => {
		await page.goto(pathname);

		const first = getQuestion(page, 1);
		const previous = first.getByRole("button", { name: "Previous question" });

		await expect(previous).toHaveAttribute("aria-disabled", "true");
		await expect(previous).toHaveJSProperty("disabled", false);
		await expect(previous).toHaveJSProperty("tabIndex", 0);

		await previous.focus();
		await expect(previous).toBeFocused();

		await previous.press("Enter");

		await expect(first).toBeVisible();
		await expect(getQuestion(page, 2)).toBeHidden();
		await expect(previous).toBeFocused();
	});

	/** Content widgets must not emit headings, so they stay out of the table of contents. */
	test("does not emit headings", async ({ page }) => {
		await page.goto(pathname);

		await expect(getQuestion(page, 1).getByRole("heading")).toHaveCount(0);
	});
});

/** Only one quiz on the page has six pages. */
function getSingleChoiceQuestion(page: Page, index: number): Locator {
	return page.getByRole("group", { name: `Question ${String(index)} of 6` });
}

/** The fill in the blank passage is not paginated, so it has no labelled group to scope to. */
function getFillInTheBlankQuiz(page: Page): Locator {
	return page.getByRole("complementary").filter({
		has: page.getByRole("textbox", { name: "Blank 1" }),
	});
}

/** The fixture quizzes are not paginated either. */
function getFixtureChoiceQuiz(page: Page): Locator {
	return page.getByRole("complementary").filter({
		has: page.getByRole("checkbox", { name: "Markdown" }),
	});
}

/** The fixture has two image drop zone exercises, told apart by a drop zone only one of them has. */
function getImageDropZonesQuiz(page: Page, zoneName: string): Locator {
	return page.getByRole("complementary").filter({
		has: page.getByRole("group", { name: zoneName }),
	});
}

/**
 * Hit testing follows the border radius, so an ellipse has to reach the browser as a radius rather than a class name.
 * Only a percentage inscribes an ellipse in the box - a length rounds the corners off into a stadium instead.
 */
function getZoneCornerRadius(quiz: Locator, zoneName: string): Promise<string> {
	return quiz.getByRole("group", { name: zoneName }).evaluate((node) => getComputedStyle(node).borderTopLeftRadius);
}

function getDragTheWordsQuiz(page: Page): Locator {
	return page.getByRole("complementary").filter({
		has: page.getByRole("list", { name: "Answers" }),
	});
}

test.describe("quiz, single choice", () => {
	test("renders questions and answer options", async ({ page }) => {
		await page.goto(variantsPathname);

		const question = getSingleChoiceQuestion(page, 1);
		await expect(question).toBeVisible();

		await expect(question.getByText("Which statement best reflects collaboration in the ECCCH?")).toBeVisible();

		await expect(question.getByRole("radio")).toHaveCount(4);
		await expect(question.getByRole("checkbox")).toHaveCount(0);
	});

	test("accepts a single correct answer", async ({ page }) => {
		await page.goto(variantsPathname);

		const question = getSingleChoiceQuestion(page, 1);
		const incorrect = question.getByRole("radio", {
			name: "Collaboration means storing data in the same place.",
		});
		const correct = question.getByRole("radio", {
			name: "Collaboration brings together people, machines and institutions through shared workflows and services.",
		});

		await incorrect.check();
		await question.getByRole("button", { name: "Check answer" }).click();

		await expect(incorrect).toHaveAttribute("aria-invalid", "true");

		/** Selecting another option deselects the first one, so only the correct answer stays marked. */
		await correct.check();
		await question.getByRole("button", { name: "Check answer" }).click();

		await expect(question.getByText("Correct!")).toBeVisible();
		await expect(correct).not.toHaveAttribute("aria-invalid", "true");
		await expect(incorrect).not.toHaveAttribute("aria-invalid", "true");
	});
});

test.describe("quiz, fill in the blank", () => {
	const answers = ["digital twin", "digital commons", "interoperability", "data models", "digital ecosystem"];

	test("renders the passage and a blank per gap", async ({ page }) => {
		await page.goto(variantsPathname);

		const quiz = getFillInTheBlankQuiz(page);
		await expect(quiz).toBeVisible();

		await expect(quiz.getByText("A structured representation produced by the museum")).toBeVisible();
		await expect(quiz.getByRole("textbox")).toHaveCount(answers.length);
	});

	test("scores the answers", async ({ page }) => {
		await page.goto(variantsPathname);

		const quiz = getFillInTheBlankQuiz(page);
		const first = quiz.getByRole("textbox", { name: "Blank 1" });
		const check = quiz.getByRole("button", { exact: true, name: "Check" });

		/**
		 * Answers are typed rather than filled: `locator.fill()` sets the value without the key events react needs, and
		 * webkit then resets the controlled field to its previous value.
		 */
		const withOneWrongAnswer = ["something else", ...answers.slice(1)];

		for (const [index, answer] of withOneWrongAnswer.entries()) {
			await quiz.getByRole("textbox", { name: `Blank ${String(index + 1)}` }).pressSequentially(answer);
		}

		await check.click();

		await expect(quiz.getByText(`${String(answers.length - 1)} / ${String(answers.length)} correct`)).toBeVisible();
		await expect(first).toHaveAttribute("aria-invalid", "true");

		/** Resetting clears the inputs through react, so the correct answers can be typed into empty fields. */
		await quiz.getByRole("button", { exact: true, name: "Reset" }).click();

		for (const [index, answer] of answers.entries()) {
			await quiz.getByRole("textbox", { name: `Blank ${String(index + 1)}` }).pressSequentially(answer);
		}

		await check.click();

		await expect(quiz.getByText(`${String(answers.length)} / ${String(answers.length)} correct`)).toBeVisible();
		await expect(first).not.toHaveAttribute("aria-invalid", "true");
	});

	test("fills in the solution on request", async ({ page }) => {
		await page.goto(variantsPathname);

		const quiz = getFillInTheBlankQuiz(page);

		await quiz.getByRole("button", { name: "Show solution" }).click();

		const first = quiz.getByRole("textbox", { name: "Blank 1" });
		await expect(first).toHaveValue(answers[0] ?? "");
		await expect(first).toHaveJSProperty("readOnly", true);
	});
});

test.describe("quiz, answer error message", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("describes only the answer which has an error message", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getFixtureChoiceQuiz(page);
		const withMessage = quiz.getByRole("checkbox", { name: "Markdown" });
		const withoutMessage = quiz.getByRole("checkbox", { name: "Git" });

		await expect(withMessage).toHaveAccessibleDescription("");

		await withMessage.check();
		await quiz.getByRole("button", { name: "Check answer" }).click();

		/** Both answers are wrong now, but only one of them has a message to show. */
		await expect(withMessage).toHaveAttribute("aria-invalid", "true");
		await expect(withoutMessage).toHaveAttribute("aria-invalid", "true");

		await expect(withMessage).toHaveAccessibleDescription(
			"Markdown is a markup language, not a version control system.",
		);
		await expect(withoutMessage).toHaveAccessibleDescription("");

		await expect(page.getByText("Markdown is a markup language")).toHaveCount(1);
	});
});

test.describe("quiz, drag the words", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("renders the passage, the word bank and a blank per gap", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getDragTheWordsQuiz(page);
		await expect(quiz).toBeVisible();

		await expect(quiz.getByText("You publish local changes with")).toBeVisible();

		/** Two answers plus the two distractors, ordered so they are indistinguishable. */
		await expect(quiz.getByRole("list", { name: "Answers" }).getByRole("listitem")).toHaveCount(4);

		await expect(quiz.getByRole("button", { name: "Blank 1. Select a word." })).toBeVisible();
		await expect(quiz.getByRole("button", { name: "Blank 2. Select a word." })).toBeVisible();
	});

	/** Words are placed through each blank's menu, which is what keyboard and touch users get. */
	test("scores the placed words", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getDragTheWordsQuiz(page);
		const check = quiz.getByRole("button", { exact: true, name: "Check" });

		await quiz.getByRole("button", { name: "Blank 1. Select a word." }).click();
		await page.getByRole("menuitem", { name: "merge" }).click();

		await expect(quiz.getByRole("button", { name: "Blank 1. Currently merge." })).toBeVisible();

		await quiz.getByRole("button", { name: "Blank 2. Select a word." }).click();
		await page.getByRole("menuitem", { name: "pull" }).click();

		await check.click();

		await expect(quiz.getByText("1 / 2 correct")).toBeVisible();

		await quiz.getByRole("button", { exact: true, name: "Reset" }).click();

		await quiz.getByRole("button", { name: "Blank 1. Select a word." }).click();
		await page.getByRole("menuitem", { name: "push" }).click();
		await quiz.getByRole("button", { name: "Blank 2. Select a word." }).click();
		await page.getByRole("menuitem", { name: "pull" }).click();

		await check.click();

		await expect(quiz.getByText("2 / 2 correct")).toBeVisible();
	});

	test("fills in the solution on request", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getDragTheWordsQuiz(page);

		await quiz.getByRole("button", { name: "Show solution" }).click();

		/**
		 * Note that the accessible name keeps saying "select a word" once solved, even though the blank now displays the
		 * answer and cannot be changed - the label only tracks words the reader placed themselves.
		 */
		const first = quiz.getByRole("button", { name: "Blank 1. Select a word." });
		await expect(first).toHaveText("push");
		await expect(first).toBeDisabled();
	});
});

test.describe("quiz, image drop zones", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("renders the image, its drop zones and the item bank", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");
		await expect(quiz).toBeVisible();

		/** The rehype plugin reads the dimensions off disk, so a missing size means the pipeline did not run. */
		await expect(quiz.getByRole("img", { name: "A plan of a church" })).toHaveAttribute("width", "640");

		await expect(quiz.getByRole("group", { name: "Nave" })).toBeVisible();
		await expect(quiz.getByRole("group", { name: "Apse" })).toBeVisible();

		/** Three items which belong in a zone, plus the distractor, ordered so the two are indistinguishable. */
		await expect(quiz.getByRole("list", { name: "Items" }).getByRole("listitem")).toHaveCount(4);
		await expect(quiz.getByRole("button", { name: "Cloister. Choose a drop zone." })).toBeVisible();
	});

	/** Items are placed through each item's menu, which is what keyboard and touch users get. */
	test("scores the placed items", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");
		const check = quiz.getByRole("button", { exact: true, name: "Check" });

		await quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Apse" }).click();

		await expect(quiz.getByRole("group", { name: "Apse" }).getByText("Long central hall")).toBeVisible();

		await check.click();

		await expect(quiz.getByText("0 / 3 correct")).toBeVisible();
		await expect(quiz.getByRole("button", { name: "Long central hall, in Apse. Incorrect. Remove." })).toBeVisible();

		await quiz.getByRole("button", { exact: true, name: "Reset" }).click();

		await quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Nave" }).click();
		await quiz.getByRole("button", { name: "Semicircular recess. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Apse" }).click();
		await quiz.getByRole("button", { name: "East end. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Apse" }).click();

		await check.click();

		await expect(quiz.getByText("3 / 3 correct")).toBeVisible();
		await expect(quiz.getByRole("button", { name: "East end, in Apse. Correct. Remove." })).toBeVisible();
	});

	test("returns a placed item to the bank", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");

		await quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Nave" }).click();

		await quiz.getByRole("button", { name: "Long central hall, in Nave. Remove." }).click();

		await expect(quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." })).toBeVisible();
		await expect(quiz.getByRole("group", { name: "Nave" }).getByRole("button")).toHaveCount(0);
	});

	test("fills in the solution on request", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");

		await quiz.getByRole("button", { name: "Show solution" }).click();

		await expect(quiz.getByRole("button", { name: "Long central hall, in Nave." })).toBeDisabled();
		await expect(quiz.getByRole("group", { name: "Apse" }).getByRole("button")).toHaveCount(2);

		/** The distractor belongs in no zone, so the solution leaves it in the bank. */
		await expect(quiz.getByRole("group", { name: "Nave" }).getByText("Cloister")).toBeHidden();
	});

	/**
	 * An item is its own control, so moving it unmounts the button the reader was on. Without help focus would fall back
	 * to the document, and a keyboard user would have to tab in again after every single move.
	 */
	test("keeps focus on the item it moves", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");
		const item = quiz.getByRole("button", { name: "Long central hall. Choose a drop zone." });

		await focusStably(item);
		await item.press("Enter");
		await page.getByRole("menuitem", { name: "Nave" }).press("Enter");

		await expect(quiz.getByRole("button", { name: "Long central hall, in Nave. Remove." })).toBeFocused();

		await page.keyboard.press("Enter");

		await expect(item).toBeFocused();
	});

	test("draws an ellipse drop zone as an ellipse", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");

		expect(await getZoneCornerRadius(quiz, "Apse")).toBe("50%");
		expect(await getZoneCornerRadius(quiz, "Nave")).not.toBe("50%");
	});

	test("reveals what the drop zones mean once the exercise is answered", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Nave");
		const explanation = quiz.getByText("The hall the congregation sits in");

		/** Held back while the exercise is still open, where it would give the answer away. */
		await expect(explanation).toBeHidden();

		await quiz.getByRole("button", { name: "Show solution" }).click();

		/** A widget emits no headings, so the section names itself with the importance `Callout` titles use. */
		await expect(quiz.getByRole("strong")).toHaveText("What the drop zones mean");
		await expect(explanation).toBeVisible();

		/** The zone is the term and its prose the definition, so a reader landing on either half gets the pairing. */
		await expect(quiz.getByRole("term")).toHaveText("Nave");
		await expect(quiz.getByRole("definition")).toContainText("congregation");

		/** Only the zone the author explained gets an entry, so the unexplained one is not listed as empty. */
		await expect(quiz.getByRole("definition")).toHaveCount(1);
	});

	/**
	 * With instant feedback the mark lands together with the item, so an item's accessible name has to change without a
	 * Check press - and the score, which is the thing that reports a submitted answer, still must not.
	 */
	test("marks an item as soon as it lands when instant feedback is on", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Primary sources");

		await quiz.getByRole("button", { name: "Charter. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Primary sources" }).click();

		await expect(quiz.getByRole("button", { name: "Charter, in Primary sources. Correct. Remove." })).toBeVisible();

		await quiz.getByRole("button", { name: "Monograph. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Primary sources" }).click();

		await expect(quiz.getByRole("button", { name: "Monograph, in Primary sources. Incorrect. Remove." })).toBeVisible();

		await expect(quiz.getByText("/ 2 correct")).toBeHidden();
	});

	test("lays out the drop zones in a grid without a background image", async ({ page }) => {
		await page.goto(fixturePathname);

		const quiz = getImageDropZonesQuiz(page, "Version control");
		await expect(quiz).toBeVisible();

		await expect(quiz.getByRole("img")).toHaveCount(0);
		await expect(quiz.getByRole("list", { name: "Items" }).getByRole("listitem")).toHaveCount(3);

		await quiz.getByRole("button", { name: "Git. Choose a drop zone." }).click();
		await page.getByRole("menuitem", { name: "Version control" }).click();

		await quiz.getByRole("button", { exact: true, name: "Check" }).click();

		await expect(quiz.getByText("1 / 3 correct")).toBeVisible();
	});
});
