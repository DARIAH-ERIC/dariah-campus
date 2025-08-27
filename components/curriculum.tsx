import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AvatarsList } from "@/components/avatars-list";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/card";
import { ContentTypeIcon } from "@/components/content-type-icon";
import { Image } from "@/components/image";
import { LastModified } from "@/components/last-modified";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { People } from "@/components/people";
import { Tags } from "@/components/tags";
import { Translations } from "@/components/translations";
import type { ContentType } from "@/lib/content/options";

interface CurriculumProps {
	children: ReactNode;
	editors: Array<{
		id: string;
		image: { src: string; height: number; width: number };
		name: string;
	}>;
	// editUrl: string;
	featuredImage?: { src: string; height: number; width: number } | null;
	// lastUpdatedAt: Date;
	resources: Array<{
		authors: Array<{
			id: string;
			image: { src: string; height: number; width: number };
			name: string;
		}>;
		kind: string;
		contentType: ContentType | "curriculum" | "event" | "pathfinder";
		id: string;
		href: string;
		locale: string;
		summary: { title: string; content: string };
		title: string;
	}>;
	tags: Array<{ id: string; name: string }>;
	title: string;
	translations: Array<{ id: string; href: string; title: string; locale: string }>;
	lastModified: number | null;
}

export function Curriculum(props: Readonly<CurriculumProps>): ReactNode {
	const { children, editors, featuredImage, lastModified, resources, tags, title, translations } =
		props;

	const t = useTranslations("Curriculum");
	const _format = useFormatter();

	return (
		<article className="mx-auto w-full max-w-(--size-content) space-y-10">
			<header className="space-y-10">
				<PageTitle>{title}</PageTitle>
				<div className="space-y-6 border-y py-10 2xl:hidden">
					<People label={t("editors")} people={editors} />
					<Tags label={t("tags")} tags={tags} />
					<Translations label={t("translations")} translations={translations} />
				</div>
			</header>
			<div>
				{featuredImage != null ? (
					<Image
						alt=""
						className="mb-8 w-full overflow-hidden rounded-lg border border-neutral-200 object-cover"
						priority={true}
						sizes="720px"
						src={featuredImage}
					/>
				) : null}
				{children}
			</div>
			<div className="flex flex-col gap-y-4">
				<h2 className="text-2xl font-bold">{t("resources")}</h2>
				<ol className="grid content-start gap-6">
					{resources.map((resource, index) => {
						const { authors, contentType, id, locale, summary, title } = resource;

						const isDraft = "draft" in resource && resource.draft === true;

						const href = isDraft ? null : resource.href;

						return (
							<li key={id} id={`resource-${String(index + 1)}`}>
								<Card isDisabled={href == null}>
									<CardContent>
										<CardTitle>
											<Link
												className="rounded transition after:absolute after:inset-0 hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
												href={href ?? undefined}
											>
												<span className="mr-2 inline-flex text-brand-700">
													<ContentTypeIcon className="size-5 shrink-0" kind={contentType} />
												</span>
												<span>{summary.title || title}</span>
											</Link>
										</CardTitle>
										<div className="flex">
											<div className="rounded bg-brand-700 px-2 py-1 text-xs font-medium text-white">
												{locale.toUpperCase()}
											</div>
										</div>
										<div className="leading-7 text-neutral-500">{summary.content}</div>
									</CardContent>
									<CardFooter>
										<AvatarsList avatars={authors} label={t("authors")} />
									</CardFooter>
								</Card>
							</li>
						);
					})}
				</ol>
			</div>
			<footer className="pt-2">
				<small>
					<LastModified timestamp={lastModified} />
				</small>
			</footer>
		</article>
	);
}
