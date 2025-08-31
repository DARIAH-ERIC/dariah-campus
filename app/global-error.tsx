"use client";

import { log } from "@acdh-oeaw/lib";
import { type ReactNode, useEffect } from "react";

import { DocumentBody } from "@/app/_components/document-body";
import { HtmlDocument } from "@/app/_components/html-document";
import { Providers } from "@/app/_components/providers";
import { Main } from "@/components/main";
import { defaultLocale } from "@/lib/i18n/locales";

export { viewport } from "@/app/_lib/viewport.config";

/**
 * Currently, the global error page does not support metadata, because error pages in next.js
 * must be client components. We can add a document title with `<title>` though.
 *
 * Also, we cannot use i18n without importing all messages client-side.
 */

interface GlobalErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalErrorPage(props: Readonly<GlobalErrorPageProps>): ReactNode {
	const { error, reset } = props;

	const locale = defaultLocale;

	const t = {
		meta: {
			title: "Error",
		},
		reset: "Try again",
		title: "Something went wrong",
	};

	useEffect(() => {
		// TODO: Log the error to an error reporting service.
		log.error(error);
	}, [error]);

	return (
		<HtmlDocument locale={locale}>
			<title>{t.meta.title}</title>
			<DocumentBody>
				<Providers locale={locale}>
					<Main>
						<h1>{t.title}</h1>
						<button
							onClick={() => {
								reset();
							}}
							type="button"
						>
							{t.reset}
						</button>
					</Main>
				</Providers>
			</DocumentBody>
		</HtmlDocument>
	);
}
