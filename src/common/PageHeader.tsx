import { useButton } from '@react-aria/button'
import { useOverlayTriggerState } from '@react-stately/overlays'
import cx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { Svg as MenuIcon } from '@/assets/icons/menu.svg'
import { Svg as SearchIcon } from '@/assets/icons/search.svg'
import { Icon } from '@/common/Icon'
import { ModalDialog } from '@/common/ModalDialog'
import { useI18n } from '@/i18n/useI18n'
import { navigation } from '@/navigation/navigation.config'
import { NavLink } from '@/navigation/NavLink'
import { useSearchDialog } from '@/search/SearchDialog.context'
import Logo from '~/public/assets/images/logo-with-text.svg'

/**
 * Page header.
 */
export function PageHeader(): JSX.Element {
  const { t } = useI18n()
  const isShadowVisible = useScrollShadow()

  return (
    <header
      className={cx(
        'fixed inset-x-0 z-20 bg-neutral-50 flex items-center justify-between px-4 xs:px-8 py-4',
        isShadowVisible && 'shadow',
      )}
      style={{ minHeight: 'var(--page-header-height)' }}
    >
      <Link href={navigation.home.href}>
        <a
          aria-label={t('common.page.home')}
          className="inline-flex transition rounde focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
        >
          <Image
            src={Logo}
            alt=""
            height="40"
            width="195"
            layout="fixed"
            priority
          />
        </a>
      </Link>
      <PageNavigation />
      <MobilePageNavigation />
    </header>
  )
}

/**
 * Main page navigation.
 */
function PageNavigation() {
  const { t } = useI18n()

  return (
    <nav className="hidden lg:items-center lg:space-x-8 lg:flex">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {Object.entries(navigation)
          .filter(([key]) => {
            return key !== 'contact'
          })
          .map(([route, { href }]) => {
            return (
              <li key={route}>
                <NavLink href={href}>
                  <a className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                    {t(`common.page.${route}`)}
                  </a>
                </NavLink>
              </li>
            )
          })}
      </ul>
      <SearchDialog />
      {/* <a
        href={navigation.contact.href}
        className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        {t('common.page.contact')}
      </a> */}
    </nav>
  )
}

/**
 * Mobile main page navigation.
 */
function MobilePageNavigation() {
  const { t } = useI18n()
  const router = useRouter()

  const dialogState = useOverlayTriggerState({})

  const openButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: openButtonProps } = useButton(
    {
      'aria-label': t('common.openMainNavigationMenu'),
      onPress() {
        dialogState.open()
      },
    },
    openButtonRef,
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

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <nav className="flex items-center space-x-6 lg:hidden">
      <SearchDialog />
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        <Icon icon={MenuIcon} className="flex-shrink-0 w-10 h-10 p-2" />
      </button>
      {dialogState.isOpen ? (
        <ModalDialog
          // TODO: use aria-label instead of title
          // If a dialog does not have a visible title element, an aria-label or aria-labelledby prop must be passed instead to identify the element to assistive technology.
          title={t('common.mainNavigationMenu')}
          isOpen
          onClose={dialogState.close}
          isDismissable
          style={{ zIndex: 1002 }}
        >
          <div className="flex flex-col">
            <ul className="flex flex-col my-6 space-y-4 overflow-y-auto font-medium">
              {Object.entries(navigation)
                .filter(([key]) => {
                  return key !== 'contact'
                })
                .map(([route, { href }]) => {
                  return (
                    <li key={route} className="flex px-2 py-2">
                      <NavLink href={href}>
                        <a className="flex items-center justify-center flex-1 py-2 transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                          {t(`common.page.${route}`)}
                        </a>
                      </NavLink>
                    </li>
                  )
                })}
            </ul>
          </div>
        </ModalDialog>
      ) : null}
    </nav>
  )
}

/**
 * Button opening the search dialog.
 */
function SearchDialog() {
  const dialogState = useSearchDialog()
  const { t } = useI18n()

  const openButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: openButtonProps } = useButton(
    {
      'aria-label': t('common.search'),
      onPress() {
        dialogState.open()
      },
    },
    openButtonRef,
  )

  return (
    <div className="flex items-center justify-center" role="search">
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        <Icon icon={SearchIcon} className="flex-shrink-0 w-10 h-10 p-2" />
      </button>
    </div>
  )
}

/**
 * Show shadow on page header when scrolled down.
 */
function useScrollShadow() {
  const [isShadowVisible, setIsShadowVisible] = useState(false)

  useEffect(() => {
    function setShadow() {
      if (window.scrollY === 0) {
        setIsShadowVisible(false)
      } else {
        setIsShadowVisible(true)
      }
    }

    window.addEventListener('scroll', setShadow, { passive: true })

    return () => {
      window.removeEventListener('scroll', setShadow)
    }
  }, [])

  return isShadowVisible
}
