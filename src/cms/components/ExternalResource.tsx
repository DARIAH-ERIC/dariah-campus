export interface ExternalResourceProps {
  title: string
  subtitle: string
  url: string
}

/**
 * External resource.
 */
export function ExternalResource(props: ExternalResourceProps): JSX.Element {
  return (
    <div className="flex flex-col items-center space-y-4 text-neutral-800 my-12 text-center">
      <strong className="text-2xl font-bold">{props.title}</strong>
      <p className="text-neutral-500">{props.subtitle}</p>
      <a
        className="px-4 py-2 font-medium !no-underline !text-white transition rounded-full bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600 select-none"
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to this resource
      </a>
    </div>
  )
}
