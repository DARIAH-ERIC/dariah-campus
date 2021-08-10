import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useOverlayTriggerState } from '@react-stately/overlays'
import { useSearchFieldState } from '@react-stately/searchfield'
import type { SearchFieldProps as AriaSearchFieldProps } from '@react-types/searchfield'
import cx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

import { Svg as AcademicCapIcon } from '@/assets/icons/academic-cap.svg'
import { Svg as DocumentIcon } from '@/assets/icons/document-text.svg'
import { Svg as LightningBoltIcon } from '@/assets/icons/lightning-bolt.svg'
import { Svg as MenuIcon } from '@/assets/icons/menu.svg'
import { Svg as SearchIcon } from '@/assets/icons/search.svg'
import { Svg as ClearIcon } from '@/assets/icons/x.svg'
import { Icon } from '@/common/Icon'
import { ModalDialog } from '@/common/ModalDialog'
import { Spinner } from '@/common/Spinner'
import { useI18n } from '@/i18n/useI18n'
import { navigation } from '@/navigation/navigation.config'
import { NavLink } from '@/navigation/NavLink'
import { routes } from '@/navigation/routes.config'
import type { SearchStatus } from '@/search/useSearch'
import { useSearch } from '@/search/useSearch'
import Logo from '~/public/assets/images/logo-tinted.svg'

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
            width="36"
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
    <nav className="hidden md:items-center md:space-x-8 md:flex">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {Object.entries(navigation)
          .filter(([key]) => key !== 'contact')
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
      <Search />
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
    <nav className="flex items-center space-x-6 md:hidden">
      <Search />
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
                .filter(([key]) => key !== 'contact')
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
 * Search button and dialog.
 */
function Search() {
  const { t } = useI18n()
  const router = useRouter()

  const dialogState = useOverlayTriggerState({})
  const [searchTerm, setSearchTerm] = useState('')
  const { data: searchResults, status } = useSearch(searchTerm)

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

  // const closeButtonRef = useRef<HTMLButtonElement>(null)
  // const { buttonProps: closeButtonProps } = useButton(
  //   {
  //     onPress() {
  //       dialogState.close()
  //     },
  //   },
  //   closeButtonRef,
  // )

  function onSubmit(searchTerm: string) {
    setSearchTerm(searchTerm.trim())
  }

  useEffect(() => {
    router.events.on('routeChangeStart', dialogState.close)

    return () => {
      router.events.off('routeChangeStart', dialogState.close)
    }
  }, [router.events, dialogState.close])

  return (
    <div role="search" className="flex items-center">
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
      >
        <Icon icon={SearchIcon} className="flex-shrink-0 w-10 h-10 p-2" />
      </button>
      {dialogState.isOpen ? (
        <ModalDialog
          // TODO: use aria-label instead of title
          // If a dialog does not have a visible title element, an aria-label or aria-labelledby prop must be passed instead to identify the element to assistive technology.
          title={t('common.search')}
          isOpen
          onClose={dialogState.close}
          isDismissable
        >
          <div className="flex flex-col space-y-4">
            <SearchField
              autoFocus
              label={t('common.search')}
              placeholder={t('common.search')}
              onSubmit={onSubmit}
              isDisabled={status === 'disabled'}
              loadingState={status}
              // FIXME: make search field controlled, or clear the searchresults when closing the dialog.
              // otherwise we will see the search results, but not the search term in the input,
              // when reopening the search dialog
              // TODO: Loading indicator
            />
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <ul className="overflow-y-auto">
                {searchResults.map((result) => {
                  const href =
                    result.type === 'courses'
                      ? routes.course({ id: result.id })
                      : routes.resource({ kind: result.kind, id: result.id })

                  const icon =
                    result.type === 'courses' ? AcademicCapIcon : DocumentIcon

                  return (
                    <li key={result.id}>
                      <article>
                        <Link href={href}>
                          <a className="flex flex-col px-2 py-2 space-y-1 transition rounded hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100">
                            <h3 className="flex items-center space-x-2 font-medium">
                              <Icon icon={icon} className="w-5 h-5" />
                              <span>{result.title}</span>
                            </h3>
                            {result._snippetResult?.abstract.value != null ? (
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: result._snippetResult.abstract.value,
                                }}
                              />
                            ) : result._snippetResult?.body.value != null ? (
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: result._snippetResult.body.value,
                                }}
                              />
                            ) : null}
                            <dl>
                              <dt className="sr-only">{t('common.tags')}</dt>
                              <dd className="my-px">
                                <ul className="flex flex-wrap">
                                  {result.tags.map((tag) => {
                                    return (
                                      <li
                                        key={tag.id}
                                        className="mb-1 mr-4 text-xs font-bold tracking-wide uppercase text-primary-600"
                                      >
                                        {tag.name}
                                      </li>
                                    )
                                  })}
                                </ul>
                              </dd>
                            </dl>
                          </a>
                        </Link>
                      </article>
                    </li>
                  )
                })}
              </ul>
            ) : searchTerm.length > 0 ? (
              <div className="py-4 text-center text-neutral-500">
                {t('common.noResultsFound')}
              </div>
            ) : null}
          </div>
        </ModalDialog>
      ) : null}
    </div>
  )
}

interface SearchFieldProps extends AriaSearchFieldProps {
  loadingState?: SearchStatus
}

/**
 * Search input field.
 */
function SearchField(props: SearchFieldProps) {
  const { label } = props
  const loadingState = props.loadingState ?? 'idle'

  const state = useSearchFieldState(props)
  const inputRef = useRef<HTMLInputElement>(null)
  const { labelProps, inputProps, clearButtonProps } = useSearchField(
    props,
    state,
    inputRef,
  )
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(clearButtonProps, buttonRef)

  return (
    <label {...labelProps} className="flex flex-col space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex px-4 py-2 space-x-4 border rounded border-neutral-200 focus-within:ring-primary-600 focus-within:ring">
        {loadingState === 'loading' ? (
          <Spinner className="flex-shrink-0 w-5 h-5 text-primary-600" />
        ) : loadingState === 'error' ? (
          <Icon
            icon={LightningBoltIcon}
            className="flex-shrink-0 w-5 h-5 text-error-600"
          />
        ) : (
          <Icon icon={SearchIcon} className="flex-shrink-0 w-5 h-5" />
        )}
        <input
          {...inputProps}
          ref={inputRef}
          className="flex-1 min-w-0 focus:outline-none"
        />
        {state.value !== '' ? (
          <button {...buttonProps} ref={buttonRef}>
            <Icon icon={ClearIcon} className="flex-shrink-0 w-5 h-5" />
          </button>
        ) : null}
      </div>
    </label>
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
