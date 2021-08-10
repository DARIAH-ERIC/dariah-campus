import { routes } from '@/navigation/routes.config'

/**
 * Links for navigation menu.
 */
export const navigation = {
  home: {
    href: routes.home(),
  },
  resources: {
    href: routes.resources(),
  },
  courses: {
    href: routes.courses(),
  },
  tags: {
    href: routes.tags(),
  },
  categories: {
    href: routes.categories(),
  },
  courseRegistry: {
    href: routes.courseRegistry(),
  },
  docs: {
    href: routes.docs({ id: 'about' }),
  },
  contact: {
    href: `https://www.dariah.eu/helpdesk/`,
  },
} as const
