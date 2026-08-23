import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "#/components/link.tsx";
import type { ContentSection } from "#/lib/content/mdx/with-content-sections.ts";
import { createHref } from "#/lib/navigation/create-href.ts";

interface ContentSectionNavigationProps {
	currentSectionId: string;
	sections: Array<ContentSection>;
}

export function ContentSectionNavigation(props: Readonly<ContentSectionNavigationProps>): ReactNode {
	const { currentSectionId, sections } = props;

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
			className="mx-auto mbs-12 grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 border-bs border-neutral-200 pbs-6 inline-full max-inline-(--size-content)"
		>
			<h2 className="sr-only" id={id}>
				{t("label")}
			</h2>

			<ContentSectionLink
				direction="previous"
				label={previous?.label ?? t("section", { index: currentIndex })}
				section={previous}
			/>

			<p className="text-sm text-neutral-500">{t("position", { current: currentIndex + 1, total: sections.length })}</p>

			<ContentSectionLink
				direction="next"
				label={next?.label ?? t("section", { index: currentIndex + 2 })}
				section={next}
			/>
		</nav>
	);
}

interface ContentSectionLinkProps {
	direction: "next" | "previous";
	label: string;
	section: ContentSection | undefined;
}

function ContentSectionLink(props: Readonly<ContentSectionLinkProps>): ReactNode {
	const { direction, label, section } = props;

	const t = useTranslations("ContentSectionNavigation");

	const isNext = direction === "next";

	if (section == null) {
		return <div />;
	}

	const Icon = isNext ? ChevronRightIcon : ChevronLeftIcon;

	return (
		<Link
			className={cn(
				"group flex items-center gap-x-2 rounded-sm py-2 transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700",
				isNext ? "flex-row-reverse justify-self-end text-end" : "justify-self-start",
			)}
			href={createHref({ searchParams: { section: section.id } })}
		>
			<Icon aria-hidden={true} className="shrink-0 block-5 inline-5" />
			<span className="grid">
				<span className="text-xs tracking-wide text-neutral-500 uppercase">{t(direction)}</span>
				<span className="font-medium">{label}</span>
			</span>
		</Link>
	);
}
