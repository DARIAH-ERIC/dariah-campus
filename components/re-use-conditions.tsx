import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "#/components/link.tsx";
import { createHref } from "#/lib/navigation/create-href.ts";

export function ReUseConditions(): ReactNode {
	const t = useTranslations("ReUseConditions");

	return (
		<div className="space-y-1.5">
			<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</h2>
			<p>
				{t.rich("reuse-conditions", {
					// oxlint-disable-next-line react/no-unstable-nested-components
					link(chunks) {
						return <ReUseCharterLink>{chunks}</ReUseCharterLink>;
					},
				})}
			</p>
		</div>
	);
}

interface ReUseCharterLinkProps {
	children: ReactNode;
}

function ReUseCharterLink(props: Readonly<ReUseCharterLinkProps>): ReactNode {
	const { children } = props;

	return (
		<Link
			className="rounded-sm text-brand-700 transition hover:text-brand-900 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
			href={createHref({ pathname: "/documentation/reuse-charter" })}
		>
			{children}
		</Link>
	);
}
