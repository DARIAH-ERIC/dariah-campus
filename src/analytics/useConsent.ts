import { useEffect, useState } from 'react'

import { service } from '@/analytics/service'

type Status = 'accepted' | 'declined'
type StoreStatus = 'initial' | 'unknown' | Status

const consentStore = {
  get() {
    return window.localStorage.getItem('analytics-consent')
  },
  set(status: Status) {
    window.localStorage.setItem('analytics-consent', status)
  },
}

export function useConsent(): [
  StoreStatus,
  { accept: () => void; decline: () => void },
] {
  const [status, setStatus] = useState<StoreStatus>('initial')

  useEffect(() => {
    const consent = consentStore.get()

    switch (consent) {
      case 'accepted':
      case 'declined':
        setStatus(consent)
        break
      default:
        setStatus('unknown')
    }
  }, [])

  useEffect(() => {
    switch (status) {
      case 'accepted':
        consentStore.set(status)
        service.optIn()
        break
      case 'declined':
        consentStore.set(status)
        service.optOut()
        break
      default:
    }
  }, [status])

  function accept() {
    setStatus('accepted')
  }

  function decline() {
    setStatus('declined')
  }

  return [status, { accept, decline }]
}
