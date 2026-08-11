import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface SourcesProps {
	sources: Array<{ id: string; name: string }>;
}

export function Sources(props: Readonly<SourcesProps>): ReactNode {
	const { sources } = props;

	const t = useTranslations("Sources");

	return (
		<div className="space-y-1.5">
			<h2 className="text-xs font-bold tracking-wide text-neutral-600 uppercase">{t("label")}</h2>
			<p>
				{sources
					.map((source) => {
						return source.name;
					})
					.join(", ")}
			</p>
		</div>
	);
}
