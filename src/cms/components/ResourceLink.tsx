import Link from 'next/link'

export interface ResourceLinkProps {
  type: 'posts'
  id: string
  label: string
}

export function ResourceLink(props: ResourceLinkProps): JSX.Element {
  return (
    <Link href={{ pathname: `/resource/${props.type}/${props.id}` }}>
      <a>{props.label}</a>
    </Link>
  )
}
