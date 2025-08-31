import "@/styles/index.css";

import cn from "clsx/lite";
import type { ComponentProps, ReactNode } from "react";

import * as fonts from "@/app/_lib/fonts";
import type { IntlLocale } from "@/lib/i18n/locales";

interface HtmlDocumentProps extends ComponentProps<"html"> {
	children: ReactNode;
	locale: IntlLocale;
}

export function HtmlDocument(props: Readonly<HtmlDocumentProps>): ReactNode {
	const { children, locale } = props;

	return (
		<html
			className={cn(
				fonts.body.variable,
				fonts.code.variable,
				"bg-neutral-50 font-body text-neutral-900 antialiased",
			)}
			lang={locale}
		>
			{children}
		</html>
	);
}
