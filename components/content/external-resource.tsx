import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface ExternalResourceProps {
	subtitle: string;
	title: string;
	url: string;
}

export function ExternalResource(props: ExternalResourceProps): ReactNode {
	const { subtitle, title, url } = props;

	const t = useTranslations("ExternalResource");

	return (
		<aside className="not-prose my-12 flex flex-col items-center space-y-4 text-center text-neutral-800">
			<strong className="text-2xl font-bold">{title}</strong>
			<p className="text-neutral-500">{subtitle}</p>
			<a
				className="select-none rounded-full bg-brand-700 px-4 py-2 font-medium text-white no-underline transition hover:bg-brand-900 focus:outline-none focus-visible:ring focus-visible:ring-brand-700"
				href={url}
				target="_blank"
			>
				{t("go-to-resource")}
			</a>
		</aside>
	);
}
