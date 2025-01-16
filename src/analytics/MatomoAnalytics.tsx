import Script from "next/script";
import type { ReactNode } from "react";

import { appId, baseUrl } from "@/analytics/analytics.config";

export function MatomoAnalytics(): ReactNode {
	if (baseUrl == null || appId == null || process.env.NODE_ENV !== "production") {
		return null;
	}

	return <Script id="analytics" dangerouslySetInnerHTML={{ __html: matomoScript }} />;
}

const matomoScript = `
var _paq = window._paq || []
_paq.push(['disableCookies'])
_paq.push(['setSecureCookie', true])
_paq.push(['enableHeartBeatTimer'])
;(function() {
  var u = "${baseUrl}"
  _paq.push(['setTrackerUrl', u + '/matomo.php'])
  _paq.push(['setSiteId', ${appId}])
  var d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0]
  g.type = 'text/javascript'
  g.async = true
  g.defer = true
  g.src = u + '/matomo.js'
  s.parentNode.insertBefore(g, s)
})()`;
