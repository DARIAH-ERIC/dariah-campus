// eslint-disable-next-line no-restricted-imports
import type { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { MobileNavSidePanel } from "@/app/(app)/_components/mobile-nav-side-panel";
import { StickyHeader } from "@/app/(app)/_components/sticky-header";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";
import logo from "@/public/assets/images/logo-dariah-with-text.svg";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	const label = t("navigation-primary");

	const navigation = {
		home: {
			href: createHref({ pathname: "/" }),
			label: t("links.home"),
		},
		resources: {
			href: createHref({ pathname: "/resources" }),
			label: t("links.resources"),
		},
		curricula: {
			href: createHref({ pathname: "/curricula" }),
			label: t("links.curricula"),
		},
		search: {
			href: createHref({ pathname: "/search" }),
			label: t("links.search"),
		},
		sources: {
			href: createHref({ pathname: "/sources" }),
			label: t("links.sources"),
		},
		"course-registry": {
			href: createHref({ pathname: "/course-registry" }),
			label: t("links.course-registry"),
		},
		documentation: {
			href: createHref({ pathname: "/documentation" }),
			label: t("links.documentation"),
		},
	};

	return (
		<StickyHeader>
			<Link
				className="shrink-0 rounded transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
				href={navigation.home.href}
			>
				<Image
					alt=""
					className="w-36 xl:w-48"
					height="40"
					src={logo as StaticImageData}
					width="195"
				/>
				<span className="sr-only">{navigation.home.label}</span>
			</Link>

			<nav aria-label={label} className="hidden lg:block">
				<ul className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2" role="list">
					{Object.entries(navigation).map(([key, link]) => {
						return (
							<li key={key}>
								<Link
									className="rounded transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
									href={link.href}
								>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<nav aria-label={label} className="lg:hidden">
				<MobileNavSidePanel
					closeLabel={t("navigation-menu-close")}
					label={t("navigation-menu")}
					navigation={navigation}
					triggerLabel={t("navigation-menu-open")}
				/>
			</nav>
		</StickyHeader>
	);
}
