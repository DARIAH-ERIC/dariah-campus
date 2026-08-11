import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface PublicationDateProps {
	publicationDate: Date;
}

export function PublicationDate(props: Readonly<PublicationDateProps>): ReactNode {
	const { publicationDate } = props;

	const t = useTranslations("PublicationDate");
	const format = useFormatter();

	return (
		<div className="space-y-1.5">
			<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</h2>
			<p>{format.dateTime(publicationDate)}</p>
		</div>
	);
}
