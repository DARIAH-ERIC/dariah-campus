import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "#/components/link.tsx";
import type { ContentSection } from "#/lib/content/mdx/with-content-sections.ts";
import { getContentSectionHref } from "#/lib/content/utils/get-content-sections.ts";

interface ContentSectionNavigationProps {
	currentSectionId: string;
	/** Url of the document, which displays the first section. */
	href: string;
	sections: Array<ContentSection>;
}

export function ContentSectionNavigation(props: Readonly<ContentSectionNavigationProps>): ReactNode {
	const { currentSectionId, href, sections } = props;

	const t = useTranslations("ContentSectionNavigation");

	const currentIndex = sections.findIndex((section) => section.id === currentSectionId);

	if (currentIndex === -1) {
		return null;
	}

	const previous = sections[currentIndex - 1];
	const next = sections[currentIndex + 1];

	const id = "content-section-navigation";

	return (
		<nav
			aria-labelledby={id}
			className="mbs-12 grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 rounded-lg border border-neutral-200 bg-neutral-100 p-6"
		>
			<h2 className="sr-only" id={id}>
				{t("label")}
			</h2>

			<ContentSectionLink
				direction="previous"
				href={previous != null ? getContentSectionHref(href, sections, previous.id) : undefined}
				label={previous?.label ?? t("section", { index: currentIndex })}
			/>

			<p className="text-sm text-neutral-500">{t("position", { current: currentIndex + 1, total: sections.length })}</p>

			<ContentSectionLink
				direction="next"
				href={next != null ? getContentSectionHref(href, sections, next.id) : undefined}
				label={next?.label ?? t("section", { index: currentIndex + 2 })}
			/>
		</nav>
	);
}

interface ContentSectionLinkProps {
	direction: "next" | "previous";
	/** Url of the linked section, absent when there is no previous or next section. */
	href: string | undefined;
	label: string;
}

function ContentSectionLink(props: Readonly<ContentSectionLinkProps>): ReactNode {
	const { direction, href, label } = props;

	const t = useTranslations("ContentSectionNavigation");

	const isNext = direction === "next";

	if (href == null) {
		return <div />;
	}

	const Icon = isNext ? ChevronRightIcon : ChevronLeftIcon;

	return (
		<Link
			className={cn(
				"group flex items-center gap-x-2 rounded-sm text-neutral-500 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700",
				isNext ? "flex-row-reverse justify-self-end text-end" : "justify-self-start",
			)}
			href={href}
		>
			<Icon aria-hidden={true} className="shrink-0 block-5 inline-5" />
			<span className="grid">
				<span className="text-xs tracking-wide text-neutral-500 uppercase">{t(direction)}</span>
				<span className="text-sm font-medium text-neutral-700 transition group-hover:text-brand-700">{label}</span>
			</span>
		</Link>
	);
}
