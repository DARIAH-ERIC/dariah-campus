import { googleAnalyticsId } from "@/analytics/analytics.config";

export interface AnalyticsService {
	registerPageView: (url: string) => void;
	optIn: () => void;
	optOut: () => void;
}

export const service: AnalyticsService = {
	registerPageView(url) {
		/* @ts-expect-error Google Analytics is initialized in `@/analytics/GoogleAnalytics`. */
		window.gtag?.("event", "page_view", {
			page_path: url,
		});

		const matomo = window._paq;
		if (matomo != null) {
			matomo.push(["setCustomUrl", window.location.href]);
			matomo.push(["setDocumentTitle", document.title]);
			matomo.push(["trackPageView"]);
			matomo.push(["enableLinkTracking"]);
		}
	},
	optIn() {
		/* @ts-expect-error All good. */
		window[`ga-disable-${googleAnalyticsId}`] = false;
		/* @ts-expect-error All good. */
		window.gtag?.("consent", "update", {
			analytics_storage: "granted",
		});
	},
	optOut() {
		/* @ts-expect-error All good. */
		window[`ga-disable-${googleAnalyticsId}`] = true;
		/* @ts-expect-error All good. */
		window.gtag?.("consent", "update", {
			analytics_storage: "denied",
		});
	},
};

declare global {
	interface Window {
		gtag?: () => void;
		_paq?: Array<unknown>;
	}
}
