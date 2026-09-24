"use client";

import { log } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { Button } from "react-aria-components";

import { PageTitle } from "#/components/page-title.tsx";

export { viewport } from "#/app/_lib/viewport.config.ts";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

// oxlint-disable-next-line import-x/no-default-export
export default function ErrorPage(props: Readonly<ErrorPageProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("ErrorPage");

	useEffect(() => {
		log.error(error);
	}, [error]);

	return (
		<div className="grid place-content-center place-items-center gap-y-6 min-block-[calc(100dvh-100px)]">
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
