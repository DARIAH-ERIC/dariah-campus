import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface LastModifiedProps {
	timestamp: number | null;
}

export function LastModified(props: Readonly<LastModifiedProps>): ReactNode {
	const { timestamp } = props;

	const t = useTranslations("LastModified");
	const format = useFormatter();

	return (
		<span>
			{t("last-modified", {
				date: format.dateTime(timestamp ?? Date.now(), { dateStyle: "long" }),
			})}
		</span>
	);
}
