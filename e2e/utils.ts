import { type Locator, expect } from "@playwright/test";

/**
 * A click on a widget with no native behaviour - a `div` with a `tab` role, say - is a silent no-op before react has
 * hydrated it, so a test which interacts straight after `goto` can lose the click entirely. React attaches its internal
 * keys to a dom node as it hydrates that node, which is what makes this observable.
 */
export async function waitForHydration(locator: Locator): Promise<void> {
	await expect
		.poll(() => locator.evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactFiber"))))
		.toBe(true);
}

/**
 * `locator.focus()` is a single shot: it resolves a node, focuses it, and returns. While the page is still hydrating,
 * react can replace that node afterwards, and the focus goes with the element it threw away - after which `toBeFocused`
 * polls a node which never received focus, and can only run out its timeout. Retrying the focus itself lets it heal
 * instead, which `waitForHydration` alone cannot do: that only proves one node has been hydrated, not that the page has
 * stopped re-rendering.
 */
export async function focusStably(locator: Locator): Promise<void> {
	await expect
		.poll(
			async () => {
				try {
					/** Kept short, so a single attempt cannot use up the budget the retries need. */
					await locator.focus({ timeout: 2000 });

					return await locator.evaluate((node) => node === document.activeElement);
				} catch {
					/** `expect.poll` fails on a throwing callback, and a node being replaced makes either call throw. */
					return false;
				}
			},
			{ intervals: [100, 250, 500, 1000], message: "Expected the element to keep focus.", timeout: 10_000 },
		)
		.toBe(true);
}
