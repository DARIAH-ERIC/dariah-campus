"use client";

import { log } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { Button } from "react-aria-components";

import { PageTitle } from "@/components/page-title";

export { viewport } from "@/app/_lib/viewport.config";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

// eslint-disable-next-line import-x/no-default-export
export default function ErrorPage(props: Readonly<ErrorPageProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("ErrorPage");

	useEffect(() => {
		// TODO: Log the error to an error reporting service.
		log.error(error);
	}, [error]);

	return (
		<div className="grid min-h-[calc(100dvh-100px)] place-content-center place-items-center gap-y-6">
			<PageTitle>{t("title")}</PageTitle>

			<Button
				className="inline-flex rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900"
				onPress={() => {
					reset();
				}}
			>
				{t("reset")}
			</Button>
		</div>
	);
}
