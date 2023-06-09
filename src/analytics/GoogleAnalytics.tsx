import Script from "next/script";
import { Fragment } from "react";

import { googleAnalyticsId } from "@/analytics/analytics.config";
import { ConsentBanner } from "@/analytics/ConsentBanner";
import { useConsent } from "@/analytics/useConsent";

/**
 * Initializes analytics service on page load in disabled state. Requires explicit opt-in to enable.
 */
export function GoogleAnalytics(): JSX.Element | null {
	const [status, { accept, reject }] = useConsent();

	if (googleAnalyticsId === undefined || process.env.NODE_ENV !== "production") {
		return null;
	}

	return (
		<Fragment>
			{status === "unknown" ? <ConsentBanner onAccept={accept} onReject={reject} /> : null}
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
			<Script
				id="google-analytics"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window['ga-disable-${googleAnalyticsId}'] = true;
            gtag('js', new Date());
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });
            gtag('config', '${googleAnalyticsId}', {
              'transport_type': 'beacon',
              'anonymize_ip': true,
            });
          `,
				}}
			/>
		</Fragment>
	);
}
