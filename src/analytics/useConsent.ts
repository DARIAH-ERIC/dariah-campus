import { useEffect, useState } from 'react'

import { service } from '@/analytics/service'

type Status = 'accepted' | 'rejected'
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
  { accept: () => void; reject: () => void },
] {
  const [status, setStatus] = useState<StoreStatus>('initial')

  useEffect(() => {
    const consent = consentStore.get()

    switch (consent) {
      case 'accepted':
      case 'rejected':
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
      case 'rejected':
        consentStore.set(status)
        service.optOut()
        break
      default:
    }
  }, [status])

  function accept() {
    setStatus('accepted')
  }

  function reject() {
    setStatus('rejected')
  }

  return [status, { accept, reject }]
}
