import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface OriginalPublicationDateProps {
	publicationDate: Date;
}

export function OriginalPublicationDate(props: Readonly<OriginalPublicationDateProps>): ReactNode {
	const { publicationDate } = props;

	const t = useTranslations("OriginalPublicationDate");
	const format = useFormatter();

	return (
		<div className="space-y-1.5">
			<dt className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</dt>
			<dd>{format.dateTime(publicationDate)}</dd>
		</div>
	);
}
