"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { I18nProvider as RacI18nProvider, RouterProvider } from "react-aria-components";

import type { IntlMessages, Locale } from "@/config/i18n.config";
import { useRouter } from "@/lib/i18n/navigation";

interface ProvidersProps {
	children: ReactNode;
	locale: Locale;
	messages: Partial<IntlMessages>;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children, locale, messages } = props;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<RacI18nProvider locale={locale}>
				<RacRouterProvider>{children}</RacRouterProvider>
			</RacI18nProvider>
		</NextIntlClientProvider>
	);
}

interface RacRouterProviderProps {
	children: ReactNode;
}

function RacRouterProvider(props: RacRouterProviderProps): ReactNode {
	const { children } = props;

	const router = useRouter();

	// eslint-disable-next-line @typescript-eslint/unbound-method
	return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
