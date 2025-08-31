import { NextIntlClientProvider } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { LocalizedStringProvider } from "react-aria-components/i18n";

import { AriaProviders } from "@/app/_components/aria-providers";
import type { IntlLocale } from "@/lib/i18n/locales";
import type { IntlMessages } from "@/lib/i18n/messages";

interface ProvidersProps {
	children: ReactNode;
	locale: IntlLocale;
	messages?: Partial<IntlMessages>;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children, locale, messages } = props;

	return (
		<Fragment>
			{/* @see https://react-spectrum.adobe.com/react-aria/ssr.html#advanced-optimization */}
			<LocalizedStringProvider locale={locale} />
			<NextIntlClientProvider locale={locale} messages={messages}>
				<AriaProviders locale={locale}>{children}</AriaProviders>
			</NextIntlClientProvider>
		</Fragment>
	);
}
