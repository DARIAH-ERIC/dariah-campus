import Link from 'next/link'

import { Svg as EventIcon } from '@/assets/icons/campus/event.svg'
import { Svg as PathfinderIcon } from '@/assets/icons/campus/pathfinder.svg'
import { Svg as ResourceIcon } from '@/assets/icons/campus/resource.svg'
import { Icon } from '@/common/Icon'
import { Section } from '@/common/Section'
import { routes } from '@/navigation/routes.config'

/**
 * Browse content section on home page.
 */
export function Browse(): JSX.Element {
  const cards = [
    {
      title: 'Resources',
      description:
        'Learn about different topics with online resources provided by DARIAH',
      path: routes.resources(),
      icon: ResourceIcon,
    },
    {
      title: 'Events',
      description:
        'Missed a face-to-face DARIAH event? Check out what happened',
      path: routes.category({ id: 'events' }),
      icon: EventIcon,
    },
    {
      title: 'Pathfinders',
      description:
        'Collections of external resources curated by the DARIAH team',
      path: routes.category({ id: 'dariah-pathfinders' }),
      icon: PathfinderIcon,
    },
  ]

  return (
    <Section>
      <Section.Title>Browse content</Section.Title>
      <Section.LeadIn>
        Choose a category to browse or search above
      </Section.LeadIn>
      <ul className="grid gap-8 py-6 md:grid-cols-3">
        {cards.map((card) => {
          return (
            <li key={card.path.pathname}>
              <Link href={card.path}>
                <a className="flex flex-col items-center h-full p-12 space-y-2 text-center transition border shadow-md border-neutral-100 rounded-xl hover:shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                  <Icon
                    icon={card.icon}
                    className="w-20 h-20 text-primary-600"
                  />
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="text-neutral-500">{card.description}</p>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
