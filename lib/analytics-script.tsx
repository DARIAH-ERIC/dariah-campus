"use client";

import { createUrl } from "@acdh-oeaw/lib";
import type { NextWebVitalsMetric } from "next/app";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { useLocale } from "next-intl";
import { Fragment, type ReactNode, Suspense, useEffect } from "react";

import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";
import { usePathname } from "@/lib/i18n/navigation";

declare global {
	interface Window {
		_paq?: Array<unknown>;
	}
}

interface AnalyticsProps {
	baseUrl: string | undefined;
	id: number | undefined;
}

export function AnalyticsScript(props: AnalyticsProps): ReactNode {
	const { baseUrl, id } = props;

	if (baseUrl == null || id == null) return null;

	return (
		<Fragment>
			<Script
				dangerouslySetInnerHTML={{
					__html: `(${String(createAnalyticsScript)})("${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}", "${String(id)}");`,
				}}
				id="analytics-script"
			/>
			<Suspense>
				<PageViewTracker />
			</Suspense>
		</Fragment>
	);
}

function createAnalyticsScript(baseUrl: string, id: number): void {
	const _paq = (window._paq = window._paq ?? []);
	_paq.push(["disableCookies"]);
	_paq.push(["enableHeartBeatTimer"]);
	const u = baseUrl;
	_paq.push(["setTrackerUrl", `${u}matomo.php`]);
	_paq.push(["setSiteId", id]);
	const d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0];
	g.async = true;
	g.src = `${u}matomo.js`;
	s?.parentNode?.insertBefore(g, s);
}

function PageViewTracker(): ReactNode {
	const locale = useLocale();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname, searchParams });
		trackPageView(locale, url);
	}, [locale, pathname, searchParams]);

	useReportWebVitals(reportWebVitals);

	return null;
}

/**
 * Track urls without locale prefix, and separate custom event for locale.
 */
function trackPageView(locale: Locale, url: URL): void {
	/** @see https://developer.matomo.org/guides/tracking-javascript-guide#custom-variables */
	window._paq?.push(["setCustomVariable", 1, "Locale", locale, "page"]);
	window._paq?.push(["setCustomUrl", url]);
	window._paq?.push(["trackPageView"]);
	window._paq?.push(["enableLinkTracking"]);
}

function reportWebVitals(metric: NextWebVitalsMetric): void {
	window._paq?.push([
		"trackEvent",
		"Analytics",
		`Web Vitals ${metric.id}`,
		metric.name,
		Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
	]);
}
