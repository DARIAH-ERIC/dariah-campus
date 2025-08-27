import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

import { MobileNavSidePanel } from "@/app/(app)/(default)/_components/mobile-nav-side-panel";
import { StickyHeader } from "@/app/(app)/(default)/_components/sticky-header";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { NavLink } from "@/components/nav-link";
import { client } from "@/lib/content";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationLink, NavigationSeparator } from "@/lib/navigation/navigation";
import logo from "@/public/assets/images/logo-dariah-with-text.svg";

interface DefaultHeaderProps extends ComponentProps<"header"> {}

export function DefaultHeader(props: Readonly<DefaultHeaderProps>): ReactNode {
	const rest = props;

	const t = useTranslations("DefaultHeader");

	const label = t("navigation.label");

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		} as NavigationLink,
		...client.singletons.navigation.get(),
	} satisfies Record<string, NavigationLink | NavigationSeparator>;

	return (
		<StickyHeader {...rest}>
			<Link
				className="shrink-0 rounded transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
				href={navigation.home.href}
			>
				<Image alt="" className="w-36 xl:w-48" height="40" src={logo} width="195" />
				<span className="sr-only">{navigation.home.label}</span>
			</Link>

			<nav aria-label={label} className="hidden lg:block">
				<ul className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2" role="list">
					{Object.entries(navigation).map(([key, _item]) => {
						const item = _item as NavigationLink | NavigationSeparator;

						switch (item.type) {
							case "link": {
								return (
									<li key={key}>
										<NavLink
											className="rounded transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
											href={item.href}
										>
											{item.label}
										</NavLink>
									</li>
								);
							}

							case "separator": {
								return (
									<li key={key} className="h-full w-px border-l-neutral-200" role="separator" />
								);
							}
						}
					})}
				</ul>
			</nav>

			<nav aria-label={label} className="lg:hidden">
				<MobileNavSidePanel
					closeLabel={t("navigation.drawer.close")}
					label={t("navigation.drawer.label")}
					navigation={navigation}
					triggerLabel={t("navigation.drawer.open")}
				/>
			</nav>
		</StickyHeader>
	);
}
