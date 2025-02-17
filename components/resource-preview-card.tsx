import type { ReactNode } from "react";

import { AvatarsList } from "@/components/avatars-list";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/card";
import { ContentTypeIcon } from "@/components/content-type-icon";
import { Link } from "@/components/link";
import type { ContentType } from "@/lib/content/options";

interface ResourcePreviewCardProps {
	contentType: ContentType | "curriculum" | "event" | "pathfinder";
	href: string;
	locale: string;
	people: Array<{ id: string; image: string; name: string }>;
	peopleLabel: string;
	summary: { title: string; content: string };
	title: string;
}

export function ResourcePreviewCard(props: ResourcePreviewCardProps): ReactNode {
	const { contentType, href, locale, people, peopleLabel, summary, title } = props;

	return (
		<Card>
			<CardContent>
				<CardTitle>
					<Link
						className="rounded transition after:absolute after:inset-0 hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
						href={href}
					>
						<span className="mr-2 inline-flex text-primary-600">
							<ContentTypeIcon className="size-5 shrink-0" kind={contentType} />
						</span>
						<span>{summary.title || title}</span>
					</Link>
				</CardTitle>
				<div className="flex">
					<div className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white">
						{locale.toUpperCase()}
					</div>
				</div>
				<div className="leading-7 text-neutral-500">{summary.content}</div>
			</CardContent>
			<CardFooter>
				<AvatarsList avatars={people} label={peopleLabel} />
			</CardFooter>
		</Card>
	);
}
