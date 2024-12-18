import Script from "next/script";
import { Fragment } from "react";

import { googleAnalyticsId } from "@/analytics/analytics.config";

/**
 * Initializes analytics service on page load in disabled state. Requires explicit opt-in to enable.
 */
export function GoogleAnalytics(): JSX.Element | null {
	if (googleAnalyticsId === undefined || process.env.NODE_ENV !== "production") {
		return null;
	}

	return (
		<Fragment>
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
