import type { Page } from "@playwright/test";
import type { ElementContext, Result, RunOptions } from "axe-core";
import { checkA11y, configureAxe, getViolations, injectAxe } from "axe-playwright";

import { config as axeConfig } from "@/config/axe.config";

export interface AccessibilityScanner {
	check: (params?: { selector?: ElementContext; skipFailures?: boolean }) => Promise<void>;
	getViolations: (params?: {
		options?: RunOptions;
		selector?: ElementContext;
	}) => Promise<Array<Result>>;
}

export async function createAccessibilityScanner(page: Page): Promise<AccessibilityScanner> {
	await injectAxe(page);
	await configureAxe(page, axeConfig);

	return {
		check(params?: { selector?: ElementContext; skipFailures?: boolean }) {
			return checkA11y(page, params?.selector, { detailedReport: true }, params?.skipFailures);
		},
		getViolations(params?: { options?: RunOptions; selector?: ElementContext }) {
			return getViolations(page, params?.selector, params?.options);
		},
	};
}
