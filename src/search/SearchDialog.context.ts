import type { OverlayTriggerState } from '@react-stately/overlays'
import { createContext, useContext } from 'react'

import { MissingContextProviderError } from '@/error/MissingContextProviderError'

/**
 * Provides search dialog state.
 */
export const SearchDialogContext = createContext<OverlayTriggerState | null>(
  null,
)

/**
 * Controls search dialog overlay.
 */
export function useSearchDialog(): OverlayTriggerState {
  const dialogState = useContext(SearchDialogContext)

  if (dialogState === null) {
    throw new MissingContextProviderError(
      'useSearchDialog',
      'SearchDialogProvider',
    )
  }

  return dialogState
}
