import { useOverlayTriggerState } from '@react-stately/overlays'
import Image from 'next/image'
import { Fragment } from 'react'

import { Svg as PlayIcon } from '@/assets/icons/campus/play.svg'
// FIXME: move to common folder
import { Video } from '@/cms/components/Video'
import { Icon } from '@/common/Icon'
import { LightBox } from '@/common/LightBox'
import { Section } from '@/common/Section'
import type { HomePageProps } from '@/pages/index.page'

export interface FeaturedVideosProps {
  videos: HomePageProps['videos']
}

/**
 * Videos section on home page.
 */
export function FeaturedVideos(props: FeaturedVideosProps): JSX.Element {
  return (
    <Section>
      <Section.Title>Why training and education?</Section.Title>
      <Section.LeadIn>
        Some thoughts on why training and education matter so much for a
        research infrastructure such as DARIAH
      </Section.LeadIn>
      <ul className="grid gap-8 py-6 md:grid-cols-3">
        {props.videos.map((video, index) => {
          return (
            <li key={index}>
              <VideoCard {...video} />
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

type VideoCardProps = FeaturedVideosProps['videos'][number]

function VideoCard(props: VideoCardProps) {
  const lightbox = useOverlayTriggerState({})

  return (
    <Fragment>
      <button
        onClick={lightbox.open}
        className="flex flex-col items-center w-full h-full p-6 space-y-4 transition shadow-md rounded-xl text-neutral-800 hover:shadow-lg focus-visible:ring focus-visible:ring-primary-600 focus:outline-none"
      >
        <div className="w-full aspect-w-16 aspect-h-9">
          <Image
            src={props.image}
            alt=""
            layout="fill"
            sizes="(max-width: 640px) 544px, (max-width: 814px) 718px, 256px"
            // placeholder="blur"
          />
        </div>
        <Icon icon={PlayIcon} className="w-12 h-12 text-primary-600" />
        <div className="flex flex-col space-y-1">
          <strong className="text-xl font-bold">{props.title}</strong>
          <p className="text-neutral-500">{props.subtitle}</p>
        </div>
      </button>
      <LightBox {...lightbox}>
        <Video
          id={props.id}
          caption={[props.title, props.subtitle].join(' - ')}
        />
      </LightBox>
    </Fragment>
  )
}
