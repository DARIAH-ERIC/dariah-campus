import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Card, CardContent, CardFooter, CardTitle } from "#/components/card.tsx";
import { Image } from "#/components/image.tsx";
import { Link } from "#/components/link.tsx";

interface SearchCardProps {
	count: string;
	href: string;
	image: StaticImageData | string;
	name: string;
	content: ReactNode;
}

export function SourceCard(props: Readonly<SearchCardProps>): ReactNode {
	const { content, count, href, image, name } = props;

	return (
		<Card>
			<Image
				alt=""
				className="aspect-[1.25] border-be border-neutral-200 object-cover inline-full"
				sizes="800px"
				src={image}
			/>
			<CardContent>
				<CardTitle>
					<Link
						className="rounded-sm transition after:absolute after:inset-0 hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
						href={href}
					>
						{name}
					</Link>
				</CardTitle>
				<div className="leading-7 text-neutral-500">{content}</div>
			</CardContent>
			<CardFooter>
				<span>{count}</span>
			</CardFooter>
		</Card>
	);
}
