import Link from "next/link";

import { type Post as PostData } from "@/cms/api/posts.api";
import { useI18n } from "@/i18n/useI18n";
import { routes } from "@/navigation/routes.config";

export interface TagsProps {
	tags: PostData["data"]["metadata"]["tags"];
}

export function Tags(props: TagsProps): JSX.Element | null {
	const { tags } = props;

	const { t } = useI18n();

	if (tags.length === 0) return null;

	return (
		<dl className="space-x-1.5 text-sm text-neutral-500">
			<dt className="inline font-medium text-neutral-600">{t("common.tags")}:</dt>
			<dd className="inline">
				<ul className="inline text-xs tracking-wide uppercase">
					{tags.map((tag, index) => {
						return (
							<li key={tag.id} className="inline">
								<Link
									href={routes.tag({ id: tag.id })}
									className="transition hover:text-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
								>
									<span>{tag.name}</span>
								</Link>
								{index !== tags.length - 1 ? <span>, </span> : null}
							</li>
						);
					})}
				</ul>
			</dd>
		</dl>
	);
}
