import { type GetStaticPropsContext, type GetStaticPropsResult } from "next";
import { Fragment } from "react";

import { PageContent } from "@/common/PageContent";
import { PageTitle } from "@/common/PageTitle";
import { getLocale } from "@/i18n/getLocale";
import { type Dictionary } from "@/i18n/loadDictionary";
import { loadDictionary } from "@/i18n/loadDictionary";
import { useI18n } from "@/i18n/useI18n";
import { Metadata } from "@/metadata/Metadata";

export interface InternalErrorPageProps {
	dictionary: Dictionary;
}

/**
 * Provides translations.
 */
export async function getStaticProps(
	context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<InternalErrorPageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);

	return {
		props: {
			dictionary,
		},
	};
}

/**
 * Internal error page.
 */
export default function InternalErrorPage(_props: InternalErrorPageProps): JSX.Element {
	const { t } = useI18n();

	return (
		<Fragment>
			<Metadata noindex nofollow title={t("common.page.error")} />
			<PageContent className="grid place-items-center">
				<PageTitle>{t("common.internalError")}</PageTitle>
			</PageContent>
		</Fragment>
	);
}
