import { useButton } from '@react-aria/button'
import { useOverlayTriggerState } from '@react-stately/overlays'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import cx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

import { Svg as TocIcon } from '@/assets/icons/toc.svg'
import { Svg as CloseIcon } from '@/assets/icons/x.svg'
import { Icon } from '@/common/Icon'
import { ModalDialog } from '@/common/ModalDialog'
import { useI18n } from '@/i18n/useI18n'
import { TableOfContents } from '@/views/post/TableOfContents'

export interface FloatingTableOfContentsProps {
  toc: Toc
}

/**
 * Floating button which opens a table of contents dialog.
 */
export function FloatingTableOfContents(
  props: FloatingTableOfContentsProps,
): JSX.Element {
  const { toc } = props

  const { t } = useI18n()
  const router = useRouter()

  const dialogState = useOverlayTriggerState({})

  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: toggleButtonProps } = useButton(
    {
      'aria-label': t('common.openTableOfContents'),
      onPress() {
        dialogState.toggle()
      },
    },
    toggleButtonRef,
  )

  // const closeButtonRef = useRef<HTMLButtonElement>(null)
  // const { buttonProps: closeButtonProps } = useButton(
  //   {
  //     onPress() {
  //       dialogState.close()
  //     },
  //   },
  //   closeButtonRef,
  // )

  useEffect(() => {
    router.events.on('routeChangeStart', dialogState.close)
    router.events.on('hashChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
      router.events.off('hashChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <nav aria-label={t('common.tableOfContents')}>
      <button
        {...toggleButtonProps}
        ref={toggleButtonRef}
        className={cx(
          'fixed flex items-center justify-center w-12 h-12 text-white rounded-full right-6 bottom-6',
          dialogState.isOpen ? 'bg-error-600' : 'bg-primary-600',
        )}
        /**
         * Keep it above the dialog - mostly to prevent browser bugs with pointer events:
         * @see https://github.com/adobe/react-spectrum/issues/1279
         * @see https://github.com/adobe/react-spectrum/issues/1513
         */
        style={{ zIndex: 1001 }}
      >
        <Icon
          icon={dialogState.isOpen ? CloseIcon : TocIcon}
          className="w-10 h-10 p-2"
        />
      </button>
      {dialogState.isOpen ? (
        <ModalDialog
          title={t('common.tableOfContents')}
          isOpen
          onClose={dialogState.close}
          isDismissable
        >
          <TableOfContents toc={toc} className="w-full space-y-2" />
        </ModalDialog>
      ) : null}
    </nav>
  )
}
