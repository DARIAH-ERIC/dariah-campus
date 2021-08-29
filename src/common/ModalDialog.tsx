import { useDialog } from '@react-aria/dialog'
import { FocusScope } from '@react-aria/focus'
import type { OverlayProps as AriaOverlayProps } from '@react-aria/overlays'
import {
  useModal,
  useOverlay,
  usePreventScroll,
  OverlayContainer,
} from '@react-aria/overlays'
import type { CSSProperties, ReactNode } from 'react'
import { useRef } from 'react'

import { usePreview } from '@/cms/previews/Preview.context'

export interface ModalDialogProps extends AriaOverlayProps {
  title?: string
  children: ReactNode
  style?: CSSProperties
}

/**
 * Modal dialog.
 */
export function ModalDialog(props: ModalDialogProps): JSX.Element {
  const { title, children } = props

  const ctx = usePreview()
  const overlayRef = useRef<HTMLDivElement>(null)
  const { overlayProps, underlayProps } = useOverlay(props, overlayRef)

  usePreventScroll()
  const { modalProps } = useModal()

  const { dialogProps, titleProps } = useDialog({}, overlayRef)

  return (
    <OverlayContainer portalContainer={(ctx.document ?? document).body}>
      <div
        {...underlayProps}
        className="fixed inset-0 z-30 flex flex-col items-center justify-start p-4 bg-black bg-opacity-50 md:p-10vmin"
        // for the cms preview
        style={{ zIndex: 1000, ...props.style }}
      >
        <FocusScope contain restoreFocus autoFocus>
          <div
            className="flex flex-col w-full max-w-screen-md p-8 overflow-auto bg-white rounded shadow-md focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
            {...overlayProps}
            {...dialogProps}
            {...modalProps}
            ref={overlayRef}
            style={props.style}
          >
            {title != null ? (
              <h2 {...titleProps} className="sr-only">
                {title}
              </h2>
            ) : null}
            {children}
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  )
}
