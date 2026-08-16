import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface LicenceProps {
	license: { label: string };
}

export function License(props: Readonly<LicenceProps>): ReactNode {
	const { license } = props;

	const t = useTranslations("License");

	return (
		<div className="space-y-1.5">
			<dt className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</dt>
			<dd>{license.label}</dd>
		</div>
	);
}
