"use client";

import { createUrl } from "@acdh-oeaw/lib";
import type { NextWebVitalsMetric } from "next/app";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { Fragment, type ReactNode, Suspense, useEffect } from "react";

import { env } from "@/config/env.config";

declare global {
	interface Window {
		_paq?: Array<unknown>;
	}
}

interface AnalyticsProps {
	baseUrl: string | undefined;
	id: number | undefined;
}

export function AnalyticsScript(props: Readonly<AnalyticsProps>): ReactNode {
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
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname, searchParams });
		trackPageView(url);
	}, [pathname, searchParams]);

	useReportWebVitals(reportWebVitals);

	return null;
}

function trackPageView(url: URL): void {
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
