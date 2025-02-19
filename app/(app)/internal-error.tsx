"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useTransition } from "react";
import { Button } from "react-aria-components";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { useRouter } from "@/lib/i18n/navigation";

interface InternalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/** `React.lazy` requires default export. */
// eslint-disable-next-line import-x/no-default-export
export default function InternalError(props: Readonly<InternalErrorProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("Error");

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<MainContent className="grid min-h-[calc(100dvh-100px)] place-content-center place-items-center gap-y-6">
			<PageTitle>{t("something-went-wrong")}</PageTitle>
			<Button
				className="inline-flex rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900"
				isPending={isPending}
				onPress={() => {
					startTransition(() => {
						router.refresh();
						reset();
					});
				}}
			>
				{t("try-again")}
			</Button>
		</MainContent>
	);
}
