import type { ReactNode } from "react";

interface EmbedProps {
	children: ReactNode;
	src: string;
	/** Added by `with-iframe-titles` mdx plugin. */
	title?: string;
}

export function Embed(props: Readonly<EmbedProps>): ReactNode {
	const { children, src, title } = props;

	return (
		<figure className="flex flex-col">
			<iframe
				allowFullScreen={true}
				className="aspect-square w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
				loading="lazy"
				referrerPolicy="strict-origin-when-cross-origin"
				src={src}
				title={title}
			/>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
