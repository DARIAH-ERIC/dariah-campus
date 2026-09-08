import { useTranslations } from "next-intl";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { AvatarsList } from "#/components/avatars-list.tsx";
import { Card, CardContent, CardFooter, CardTitle } from "#/components/card.tsx";
import { ContentTypeIcon } from "#/components/content-type-icon.tsx";
import { Link } from "#/components/link.tsx";
import type { ContentType } from "#/lib/content/options.ts";

interface ResourcePreviewCardProps {
	contentType: ContentType | "curriculum" | "event" | "pathfinder";
	href: string | null;
	locale: string;
	people: Array<{
		id: string;
		image: StaticImageData | string;
		name: string;
	}>;
	peopleLabel: string;
	summary: { title: string; content: string };
	title: string;
}

export function ResourcePreviewCard(props: Readonly<ResourcePreviewCardProps>): ReactNode {
	const { contentType, href, locale, people, peopleLabel, summary, title } = props;

	const t = useTranslations("ResourcePreviewCard");

	return (
		<Card isDisabled={href == null}>
			<CardContent>
				<CardTitle>
					<Link
						className="rounded-sm transition after:absolute after:inset-0 hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
						href={href ?? undefined}
					>
						<span className="me-2 inline-flex text-brand-700">
							<ContentTypeIcon className="shrink-0 block-5 inline-5" kind={contentType} />
						</span>
						<span>{summary.title || title}</span>
					</Link>
				</CardTitle>
				<div className="flex">
					<div className="rounded-sm bg-brand-700 px-2 py-1 text-xs font-medium text-white">{locale.toUpperCase()}</div>
				</div>
				<div className="leading-7 text-neutral-500">{summary.content}</div>
			</CardContent>
			<CardFooter>
				<AvatarsList avatars={people} label={peopleLabel} />
				{href == null ? <span className="text-sm text-neutral-500">{t("coming-soon")}</span> : null}
			</CardFooter>
		</Card>
	);
}
