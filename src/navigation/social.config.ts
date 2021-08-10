import { Svg as EmailIcon } from '@/assets/icons/at-symbol.svg'
import { Svg as FlickrIcon } from '@/assets/icons/brand/flickr.svg'
import { Svg as GitHubIcon } from '@/assets/icons/brand/github.svg'
import { Svg as TwitterIcon } from '@/assets/icons/brand/twitter.svg'
import { Svg as YouTubeIcon } from '@/assets/icons/brand/youtube.svg'
import { Svg as GlobeIcon } from '@/assets/icons/globe-alt.svg'
import { Svg as RssIcon } from '@/assets/icons/rss.svg'
import { feedFileName } from '~/config/site.config'

/**
 * Social links.
 */
export const social = {
  twitter: {
    href: 'https://twitter.com/dariaheu',
    label: 'Twitter',
    icon: TwitterIcon,
  },
  flickr: {
    href: 'https://www.flickr.com/photos/142235661@N08/albums/with/72157695786965901',
    label: 'Flickr',
    icon: FlickrIcon,
  },
  youtube: {
    href: 'https://www.youtube.com/channel/UCeQpM_gUvNZXUWf6qQ226GQ',
    label: 'YouTube',
    icon: YouTubeIcon,
  },
  github: {
    href: 'https://github.com/DARIAH-ERIC',
    label: 'GitHub',
    icon: GitHubIcon,
  },
  rss: {
    href: '/' + feedFileName,
    label: 'RSS Feed',
    icon: RssIcon,
  },
  email: {
    href: 'https://www.dariah.eu/helpdesk/',
    label: 'Email',
    icon: EmailIcon,
  },
  website: {
    href: 'https://www.dariah.eu/',
    label: 'Website',
    icon: GlobeIcon,
  },
}
