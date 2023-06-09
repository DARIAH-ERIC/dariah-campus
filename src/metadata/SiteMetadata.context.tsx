import { type ReactNode } from "react";
import { createContext, useMemo } from "react";

import { useLocale } from "@/i18n/useLocale";
import { type SiteMetadata } from "~/config/siteMetadata.config";
import { siteMetadata } from "~/config/siteMetadata.config";

export const SiteMetadataContext = createContext<SiteMetadata | null>(null);

export interface SiteMetadataProviderProps {
	children?: ReactNode;
}

/**
 * Provides site metadata for the currently active locale.
 */
export function SiteMetadataProvider(props: SiteMetadataProviderProps): JSX.Element {
	const { locale } = useLocale();

	const metadata = useMemo(() => {
		return siteMetadata[locale];
	}, [locale]);

	return (
		<SiteMetadataContext.Provider value={metadata}>{props.children}</SiteMetadataContext.Provider>
	);
}
