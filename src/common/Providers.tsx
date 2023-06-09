import { type ReactNode } from "react";
import { I18nProvider as UiI18nProvider, SSRProvider } from "react-aria";

import { type I18nProviderProps } from "@/i18n/I18n.context";
import { I18nProvider } from "@/i18n/I18n.context";
import { useLocale } from "@/i18n/useLocale";
import { SiteMetadataProvider } from "@/metadata/SiteMetadata.context";
import { SearchDialog } from "@/search/SearchDialog";

export interface ProvidersProps {
	children: ReactNode;
	dictionary?: I18nProviderProps["dictionary"];
}

/**
 * Shared context providers.
 */
export function Providers(props: ProvidersProps): JSX.Element {
	const { locale } = useLocale();

	return (
		<SSRProvider>
			<I18nProvider locale={locale} dictionary={props.dictionary}>
				<UiI18nProvider locale={locale}>
					<SiteMetadataProvider>
						<SearchDialog>{props.children}</SearchDialog>
					</SiteMetadataProvider>
				</UiI18nProvider>
			</I18nProvider>
		</SSRProvider>
	);
}
