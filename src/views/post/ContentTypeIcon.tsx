import type { FC, SVGProps } from 'react'

import { Svg as AudioIcon } from '@/assets/icons/campus/audio.svg'
import { Svg as BookIcon } from '@/assets/icons/campus/book.svg'
import { Svg as EventIcon } from '@/assets/icons/campus/event.svg'
import { Svg as GlobeIcon } from '@/assets/icons/campus/globe.svg'
import { Svg as PathfinderIcon } from '@/assets/icons/campus/pathfinder.svg'
import { Svg as VideoIcon } from '@/assets/icons/campus/video.svg'
import type { PostPreview } from '@/cms/api/posts.api'
import { Icon } from '@/common/Icon'

const contentTypeIcons: Record<
  PostPreview['type']['id'],
  FC<SVGProps<SVGSVGElement> & { title?: string }>
> = {
  audio: AudioIcon,
  event: EventIcon,
  pathfinder: PathfinderIcon,
  slides: BookIcon,
  'training-module': BookIcon,
  video: VideoIcon,
  'webinar-recording': BookIcon,
  website: GlobeIcon,
}

export interface ContentTypeIconProps {
  className?: string
  type: PostPreview['type']['id']
}

/**
 * Icon for resource content-type.
 */
export function ContentTypeIcon(
  props: ContentTypeIconProps,
): JSX.Element | null {
  const icon = contentTypeIcons[props.type]

  if (icon == null) return null

  return <Icon icon={icon} className={props.className} />
}
