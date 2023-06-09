import { type PageMetadataProps } from "@stefanprobst/next-page-metadata";
import { PageMetadata } from "@stefanprobst/next-page-metadata";

import { useLocale } from "@/i18n/useLocale";
import { useSiteMetadata } from "@/metadata/useSiteMetadata";

export type MetadataProps = PageMetadataProps;

/**
 * Page metadata for SEO.
 */
export function Metadata({ openGraph, twitter, ...props }: MetadataProps): JSX.Element {
	const { locale } = useLocale();
	const { title: siteTitle, image: siteImage, description: siteDescription } = useSiteMetadata();

	function defaultTitleTemplate(title?: string) {
		return [title, siteTitle].filter(Boolean).join(" | ");
	}

	return (
		<PageMetadata
			language={locale}
			titleTemplate={defaultTitleTemplate}
			description={siteDescription}
			openGraph={{
				type: "website",
				siteName: siteTitle,
				images: [
					{
						src: siteImage.publicPath,
						alt: "",
					},
				],
				...openGraph,
			}}
			twitter={{
				cardType: "summary",
				site: siteTitle,
				...twitter,
			}}
			{...props}
		/>
	);
}
