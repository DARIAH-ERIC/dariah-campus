import Link from 'next/link'

import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

export interface ConsentBannerProps {
  onAccept: () => void
  onReject: () => void
}

/**
 * Consent banner.
 */
export function ConsentBanner(props: ConsentBannerProps): JSX.Element {
  const { t } = useI18n()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center p-4 space-x-3 text-sm font-medium text-white bg-primary-600">
      <p className="mx-2">
        <span>{t('common.consent.message')} </span>
        <Link href={routes.imprint()}>
          <a className="underline hover:no-underline focus:ring focus:ring-white focus:ring-offset-primary-600">
            {t('common.consent.privacyPolicyPageLink')}
          </a>
        </Link>
      </p>
      <button
        className="px-3 py-1 text-sm font-medium bg-white rounded-full text-primary-600 focus:ring focus:ring-white focus:ring-offset-primary-600"
        onClick={props.onReject}
      >
        {t('common.consent.reject')}
      </button>
      <button
        className="px-3 py-1 text-sm font-medium bg-white rounded-full text-primary-600 focus:ring focus:ring-white focus:ring-offset-primary-600"
        onClick={props.onAccept}
      >
        {t('common.consent.accept')}
      </button>
    </div>
  )
}
