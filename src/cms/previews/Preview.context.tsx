import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

interface PreviewContextValues {
  /**
   * The preview iframe's `document`.
   */
  document?: Document
}

const PreviewContext = createContext<PreviewContextValues>({})

export interface PreviewProviderProps extends PreviewTemplateComponentProps {
  children: ReactNode
}

/**
 * Provides preview iframe values via context.
 */
export function PreviewProvider(props: PreviewProviderProps): JSX.Element {
  const { document, children } = props

  const context = useMemo(() => {
    return { document }
  }, [document])

  return (
    <PreviewContext.Provider value={context}>
      {children}
    </PreviewContext.Provider>
  )
}

export function usePreview(): PreviewContextValues {
  return useContext(PreviewContext)
}
