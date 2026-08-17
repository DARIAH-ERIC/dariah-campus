import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { resources as sharedMetadata } from "#/lib/content/shared-metadata.config";

export function Domain(): ReactNode {
	const { domain } = sharedMetadata;

	const t = useTranslations("Domain");

	return (
		<div className="space-y-1.5">
			<dt className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</dt>
			<dd>{domain}</dd>
		</div>
	);
}
