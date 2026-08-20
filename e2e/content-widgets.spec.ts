import { type Locator, expect, test } from "@playwright/test";

/**
 * Carousel, image layers, the image comparison slider, image hotspots and the link button have no published content
 * using them at all, so everything here runs against the fixture resource - see `e2e/fixtures/resources/`.
 */
const pathname = "/resources/hosted/e2e-content-widgets";

const assetPrefix = "/assets/content/assets/en/resources/hosted/e2e-content-widgets";

/**
 * A click on a widget with no native behaviour - a `div` with a `tab` role, say - is a silent no-op before react has
 * hydrated it, so a test which interacts straight after `goto` can lose the click entirely. React attaches its internal
 * keys to a dom node as it hydrates that node, which is what makes this observable.
 */
async function waitForHydration(locator: Locator): Promise<void> {
	await expect
		.poll(() => locator.evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactFiber"))))
		.toBe(true);
}

test.describe("carousel", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("renders every slide with its caption", async ({ page }) => {
		await page.goto(pathname);

		const carousel = page.getByRole("group", { name: "Fixture slides" });
		await expect(carousel).toBeVisible();
		await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");

		await expect(carousel.getByRole("group", { name: "Slide 1 of 3" })).toBeVisible();
		await expect(carousel.getByRole("img", { name: "First slide" })).toBeVisible();
		await expect(carousel.getByText("Caption of the third slide")).toBeVisible();

		/** The rehype plugin reads the dimensions off disk, so a missing size means the pipeline did not run. */
		await expect(carousel.getByRole("img", { name: "First slide" })).toHaveAttribute("width", "640");
	});

	test("moves between slides", async ({ page }) => {
		await page.goto(pathname);

		const carousel = page.getByRole("group", { name: "Fixture slides" });
		const next = carousel.getByRole("button", { name: "Next slide" });

		/** The controls only know what they can scroll to once embla has initialised. */
		await expect(next).toHaveAttribute("aria-disabled", "false");

		await expect(carousel.getByRole("button", { name: "Slide 1" })).toHaveAttribute("aria-disabled", "true");

		await next.click();

		await expect(carousel.getByRole("button", { name: "Slide 2" })).toHaveAttribute("aria-disabled", "true");

		await carousel.getByRole("button", { name: "Previous slide" }).click();

		await expect(carousel.getByRole("button", { name: "Slide 1" })).toHaveAttribute("aria-disabled", "true");
	});

	/** The boundary controls are `aria-disabled`, so they keep keyboard focus at the first and last slide. */
	test("keeps the boundary control focusable but inert", async ({ page }) => {
		await page.goto(pathname);

		const carousel = page.getByRole("group", { name: "Fixture slides" });
		const previous = carousel.getByRole("button", { name: "Previous slide" });

		await expect(previous).toHaveAttribute("aria-disabled", "true");
		await expect(previous).toHaveJSProperty("disabled", false);
		await expect(previous).toHaveJSProperty("tabIndex", 0);

		await previous.focus();
		await previous.press("Enter");

		await expect(carousel.getByRole("button", { name: "Slide 1" })).toHaveAttribute("aria-disabled", "true");
		await expect(previous).toBeFocused();
	});
});

test.describe("image layers", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("reveals a layer at a time", async ({ page }) => {
		await page.goto(pathname);

		const slider = page.getByRole("slider", { name: "Excavation phases" });
		await expect(slider).toBeVisible();

		await expect(page.getByText("Base (1 of 3)")).toBeVisible();

		await page.getByRole("button", { name: "Show more layers" }).click();

		await expect(page.getByText("Walls (2 of 3)")).toBeVisible();

		/** A layer without a label falls back to its position. */
		await page.getByRole("button", { name: "Show more layers" }).click();

		await expect(page.getByText("Layer 3 (3 of 3)")).toBeVisible();

		await page.getByRole("button", { name: "Show fewer layers" }).click();

		await expect(page.getByText("Walls (2 of 3)")).toBeVisible();
	});

	test("keeps the boundary control focusable but inert", async ({ page }) => {
		await page.goto(pathname);

		const previous = page.getByRole("button", { name: "Show fewer layers" });

		await expect(previous).toHaveAttribute("aria-disabled", "true");
		await expect(previous).toHaveJSProperty("disabled", false);
		await expect(previous).toHaveJSProperty("tabIndex", 0);

		await previous.focus();
		await previous.press("Enter");

		await expect(page.getByText("Base (1 of 3)")).toBeVisible();
		await expect(previous).toBeFocused();
	});
});

test.describe("image comparison slider", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	/**
	 * Both images are hardcoded to `alt=""`, so they carry no role, hence reading them out of the dom rather than through
	 * a role locator.
	 */
	test("renders both images and the caption", async ({ page }) => {
		await page.goto(pathname);

		const caption = page.getByText("Before and after conservation");
		await expect(caption).toBeVisible();

		const figure = page.getByRole("figure").filter({ has: caption });

		const sources = await figure.evaluate((node) =>
			Array.from(node.querySelectorAll("img")).map((image) => image.getAttribute("src")),
		);

		expect(sources).toStrictEqual([`${assetPrefix}/layer-1.png`, `${assetPrefix}/layer-3.png`]);
	});

	/** The separator between the two images is focusable and moves with the arrow keys. */
	test("moves the separator with the arrow keys", async ({ page }) => {
		await page.goto(pathname);

		const separator = page.getByRole("separator", { name: "Use arrow keys to move separator" });
		await expect(separator).toBeVisible();

		/** A focusable separator is a range widget, so it has to report where it sits. */
		await expect(separator).toHaveAttribute("aria-valuenow", "50");
		await expect(separator).toHaveAttribute("aria-orientation", "vertical");

		function readPosition(): Promise<string | undefined> {
			return separator.evaluate((node) => node.parentElement?.style.getPropertyValue("--position"));
		}

		/** The separator starts at `0px` and is centred once the widget has measured itself on the client. */
		await expect.poll(readPosition).not.toBe("0px");

		const before = await readPosition();

		await separator.focus();
		await expect(separator).toBeFocused();

		await separator.press("ArrowRight");

		await expect.poll(readPosition).not.toBe(before);

		await expect(separator).not.toHaveAttribute("aria-valuenow", "50");

		await separator.press("ArrowLeft");

		await expect.poll(readPosition).toBe(before);
		await expect(separator).toHaveAttribute("aria-valuenow", "50");
	});
});

test.describe("quiz, image hotspots", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("shows an annotation for the selected hotspot", async ({ page }) => {
		await page.goto(pathname);

		const panel = page.getByRole("complementary", { name: "Image annotation" });

		await expect(panel).toContainText("Select a point on the image to view its annotation.");

		await page.getByRole("button", { name: "Nave" }).click();

		await expect(panel).toContainText("The central aisle of the building.");
		await expect(panel).not.toContainText("Select a point on the image");

		await page.getByRole("button", { name: "Apse" }).click();

		await expect(panel).toContainText("The semicircular recess at the east end.");

		await panel.getByRole("button", { name: "Close annotation" }).click();

		await expect(panel).toContainText("Select a point on the image to view its annotation.");
	});
});

test.describe("tabs", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("shows the panel of the selected tab", async ({ page }) => {
		await page.goto(pathname);

		const first = page.getByRole("tab", { name: "Command line" });
		const second = page.getByRole("tab", { name: "Graphical client" });

		await waitForHydration(first);

		await expect(first).toHaveAttribute("aria-selected", "true");
		await expect(page.getByRole("tabpanel")).toContainText("Run git status to see what changed.");

		await second.click();

		await expect(second).toHaveAttribute("aria-selected", "true");
		await expect(page.getByRole("tabpanel")).toContainText("Open the repository and look at the changes pane.");
	});

	test("moves between tabs with the arrow keys", async ({ page }) => {
		await page.goto(pathname);

		const first = page.getByRole("tab", { name: "Command line" });
		const second = page.getByRole("tab", { name: "Graphical client" });

		await waitForHydration(first);

		await first.focus();
		await expect(first).toBeFocused();

		await page.keyboard.press("ArrowRight");

		await expect(second).toBeFocused();
		await expect(second).toHaveAttribute("aria-selected", "true");
	});
});

test.describe("disclosure", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("hides its content until it is opened", async ({ page }) => {
		await page.goto(pathname);

		const content = page.getByText("Hidden until the summary is activated.");
		await expect(content).toBeHidden();

		await page.getByText("Supplementary reading").click();

		await expect(content).toBeVisible();
	});
});

test.describe("static widgets", () => {
	test.beforeEach(() => {
		test.skip(
			// oxlint-disable-next-line node/no-process-env
			Boolean(process.env.PLAYWRIGHT_TEST_APP_BASE_URL),
			"The content widget fixture is not part of a deployed app.",
		);
	});

	test("render their content", async ({ page }) => {
		await page.goto(pathname);

		await expect(page.getByText("A tip")).toBeVisible();
		await expect(page.getByText("Callouts carry a title and rich text.")).toBeVisible();

		await expect(page.getByRole("img", { name: "A figure" })).toBeVisible();
		await expect(page.getByText("Caption of the figure")).toBeVisible();

		await expect(page.getByText("Left hand column.")).toBeVisible();
		await expect(page.getByText("Right hand column.")).toBeVisible();

		await expect(page.getByRole("link", { name: "Visit DARIAH" })).toHaveAttribute("href", "https://www.dariah.eu");
	});
});
