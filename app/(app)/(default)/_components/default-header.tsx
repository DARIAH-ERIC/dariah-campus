import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { MobileNavSidePanel } from "#/app/(app)/(default)/_components/mobile-nav-side-panel.tsx";
import { StickyHeader } from "#/app/(app)/(default)/_components/sticky-header.tsx";
import { Image } from "#/components/image.tsx";
import { Link } from "#/components/link.tsx";
import { NavLink } from "#/components/nav-link.tsx";
import { createClient } from "#/lib/content/create-client.ts";
import { createHref } from "#/lib/navigation/create-href.ts";
import type { NavigationLink, NavigationSeparator } from "#/lib/navigation/navigation.ts";
import logo from "#/public/assets/images/logo-dariah-campus.svg";

interface DefaultHeaderProps extends ComponentProps<"header"> {}

export async function DefaultHeader(props: Readonly<DefaultHeaderProps>): Promise<ReactNode> {
	const rest = props;

	const t = await getTranslations("DefaultHeader");

	const client = await createClient();

	const label = t("navigation.label");

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		} as NavigationLink,
		...(await client.singletons.navigation.get()),
	} satisfies Record<string, NavigationLink | NavigationSeparator>;

	return (
		<StickyHeader {...rest}>
			<Link
				className="shrink-0 rounded-sm transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
				href={navigation.home.href}
			>
				<Image alt="" className="block-auto inline-36 xl:inline-48" loading="eager" preload={true} src={logo} />
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
											className="rounded-sm transition hover:text-brand-700 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
											href={item.href}
										>
											{item.label}
										</NavLink>
									</li>
								);
							}

							case "separator": {
								return <li key={key} className="border-s-neutral-200 block-full inline-px" role="separator" />;
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
