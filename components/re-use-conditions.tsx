import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";

export function ReUseConditions(): ReactNode {
	const t = useTranslations("ReUseConditions");

	return (
		<div className="space-y-1.5">
			<h2 className="text-xs font-bold uppercase tracking-wide text-neutral-600">{t("label")}</h2>
			<p>
				{t.rich("reuse-conditions", {
					// eslint-disable-next-line react/no-unstable-nested-components
					link(chunks) {
						return (
							<Link
								className="rounded text-primary-600 transition hover:text-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
								href={createHref({ pathname: "/documentation/reuse-charter" })}
							>
								{chunks}
							</Link>
						);
					},
				})}
			</p>
		</div>
	);
}
