import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, Suspense } from "react";

import { DefaultFooter } from "@/app/(app)/(default)/_components/default-footer";
import { DefaultHeader } from "@/app/(app)/(default)/_components/default-header";
import { Main } from "@/components/main";
import { PreviewModeBanner } from "@/components/preview-mode-banner";
import { SkipLink } from "@/components/skip-link";

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

			<div className="relative isolate grid min-h-full grid-rows-[auto_1fr_auto]">
				<DefaultHeader />
				<Main className="min-w-0 flex-1" id={mainContentId}>
					{children}
				</Main>
				<DefaultFooter />
			</div>
		</Fragment>
	);
}
