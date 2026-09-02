import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, Suspense } from "react";

import { DefaultFooter } from "#/app/(app)/(default)/_components/default-footer.tsx";
import { DefaultHeader } from "#/app/(app)/(default)/_components/default-header.tsx";
import { Main } from "#/components/main.tsx";
import { PreviewModeBanner } from "#/components/preview-mode-banner.tsx";
import { SkipLink } from "#/components/skip-link.tsx";

const mainContentId = "main-content";

interface DefaultLayoutProps extends LayoutProps<"/"> {}

export default function DefaultLayout(props: Readonly<DefaultLayoutProps>): ReactNode {
	const { children } = props;

	const t = useTranslations("DefaultLayout");

	return (
		<Fragment>
			<SkipLink href={`#${mainContentId}`}>{t("skip-link")}</SkipLink>

			<Suspense>
				<PreviewModeBanner />
			</Suspense>

			<div className="relative isolate grid grid-rows-[auto_1fr_auto] min-block-full">
				<DefaultHeader />

				<Main className="flex-1 min-inline-0" id={mainContentId}>
					{children}
				</Main>

				<DefaultFooter />
			</div>
		</Fragment>
	);
}
