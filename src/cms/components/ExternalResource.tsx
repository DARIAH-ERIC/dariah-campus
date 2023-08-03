export interface ExternalResourceProps {
	title: string;
	subtitle: string;
	url: string;
}

/**
 * External resource.
 */
export function ExternalResource(props: ExternalResourceProps): JSX.Element {
	return (
		<div className="flex flex-col items-center my-12 space-y-4 text-center not-prose text-neutral-800">
			<strong className="text-2xl font-bold">{props.title}</strong>
			<p className="text-neutral-500">{props.subtitle}</p>
			<a
				className="px-4 py-2 font-medium text-white no-underline transition rounded-full select-none bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
				href={props.url}
				target="_blank"
				rel="noopener noreferrer"
			>
				Go to this resource
			</a>
		</div>
	);
}
