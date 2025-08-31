"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
	I18nProvider as AriaI18nProvider,
	RouterProvider as AriaRouterProvider,
} from "react-aria-components";

import type { IntlLocale } from "@/lib/i18n/locales";

interface AriaProvidersProps {
	children: ReactNode;
	locale: IntlLocale;
}

export function AriaProviders(props: Readonly<AriaProvidersProps>): ReactNode {
	const { children, locale } = props;

	const router = useRouter();

	return (
		<AriaI18nProvider locale={locale}>
			{/* eslint-disable-next-line @typescript-eslint/unbound-method */}
			<AriaRouterProvider navigate={router.push}>{children}</AriaRouterProvider>
		</AriaI18nProvider>
	);
}
