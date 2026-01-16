import type { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AvatarsList } from "@/components/avatars-list";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/card";
import { ContentTypeIcon } from "@/components/content-type-icon";
import { Link } from "@/components/link";
import type { ContentType } from "@/lib/content/options";

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
						<span className="mr-2 inline-flex text-brand-700">
							<ContentTypeIcon className="size-5 shrink-0" kind={contentType} />
						</span>
						<span>{summary.title || title}</span>
					</Link>
				</CardTitle>
				<div className="flex">
					<div className="rounded-sm bg-brand-700 px-2 py-1 text-xs font-medium text-white">
						{locale.toUpperCase()}
					</div>
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
