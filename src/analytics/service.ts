import { googleAnalyticsId } from '@/analytics/analytics.config'

export interface AnalyticsService {
  registerPageView: (url: string) => void
  optIn: () => void
  optOut: () => void
}

export const service: AnalyticsService = {
  registerPageView(url) {
    /* @ts-expect-error Google Analytics is initialized in `@/analytics/Analytics`. */
    window.gtag?.('config', googleAnalyticsId, {
      page_path: url,
    })
  },
  optIn() {
    /* @ts-expect-error All good. */
    window[`ga-disable-${googleAnalyticsId}`] = false
  },
  optOut() {
    /* @ts-expect-error All good. */
    window[`ga-disable-${googleAnalyticsId}`] = true
  },
}
