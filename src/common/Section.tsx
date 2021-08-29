import type { ReactNode } from 'react'

export interface SectionProps {
  children: ReactNode
}

/**
 * Section.
 */
export function Section(props: SectionProps): JSX.Element {
  return (
    <section className="flex flex-col space-y-2 text-center">
      {props.children}
    </section>
  )
}

Section.Title = SectionTitle
Section.LeadIn = SectionLeadIn

interface SectionTitleProps {
  children: ReactNode
}

/**
 * Section title.
 */
function SectionTitle(props: SectionTitleProps): JSX.Element {
  return <h2 className="text-3xl lg:text-4xl font-bold">{props.children}</h2>
}

interface SectionLeadInProps {
  children: ReactNode
}

/**
 * Section lead-in.
 */
function SectionLeadIn(props: SectionLeadInProps): JSX.Element {
  return <p className="text-lg lg:text-xl text-neutral-500">{props.children}</p>
}
