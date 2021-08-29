import * as path from 'path'

import { useButton } from '@react-aria/button'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment, useRef } from 'react'

import { Svg as SearchIcon } from '@/assets/icons/search.svg'
import type { Person } from '@/cms/api/people.api'
import { getPersonById } from '@/cms/api/people.api'
import { createStaticImage } from '@/cms/utils/createStaticImage'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { useSearchDialog } from '@/search/SearchDialog.context'
import type { FilePath } from '@/utils/ts/aliases'
import { Browse } from '@/views/home/Browse'
import { FAQ } from '@/views/home/FAQ'
import { FeaturedVideos } from '@/views/home/FeaturedVideos'
import { Hero } from '@/views/home/Hero'
import { Team } from '@/views/home/Team'
import featured from '~/config/featured.json'
import teamMembers from '~/config/team.json'

export interface FeaturedVideo {
  id: string
  title: string
  subtitle: string
  image:
    | FilePath
    | { src: FilePath; width: number; height: number; blurDataURL?: string }
}

export interface HomePageProps {
  dictionary: Dictionary
  team: Array<Person>
  videos: Array<FeaturedVideo>
}

/**
 * Provides data and translations.
 */
export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const teamIds = teamMembers.sort()
  const team = await Promise.all(
    teamIds.map((id) => {
      return getPersonById(id, locale)
    }),
  )

  const videos = await Promise.all(
    featured.videos.map(async (video) => {
      return {
        ...video,
        image: await createStaticImage(
          video.image,
          path.join(
            process.cwd(),
            'public/assets/images/featured-videos/image.png',
          ),
        ),
      }
    }),
  )

  return {
    props: {
      dictionary,
      team,
      videos,
    },
  }
}

/**
 * Home page.
 */
export default function HomePage(props: HomePageProps): JSX.Element {
  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.home')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="w-full max-w-screen-lg px-4 py-8 mx-auto space-y-24 xs:px-8 xs:py-16 md:py-24">
        <Hero />
        <SearchDialog />
        <Browse />
        <FAQ />
        <FeaturedVideos videos={props.videos} />
        <Team team={props.team} />
      </PageContent>
    </Fragment>
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
    <div className="flex justify-center" role="search">
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="flex items-center flex-1 max-w-2xl px-4 py-3 text-lg transition border rounded-full shadow-xl border-neutral-150 text-neutral-500 hover:text-primary-600 hover:border-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600 focus-visible:border-primary-600"
      >
        <Icon
          icon={SearchIcon}
          className="flex-shrink-0 w-9 h-9 p-2 stroke-2"
        />
        <span>{t('common.search')}</span>
      </button>
    </div>
  )
}
