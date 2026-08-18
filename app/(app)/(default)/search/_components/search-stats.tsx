"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";

export function SearchStats(): ReactNode {
	const t = useTranslations("SearchPage");
	const { hasData, isLoading, pagination } = useSearch();

	return (
		<div className="mx-auto grid place-items-center text-sm text-neutral-600 block-5 inline-full" role="status">
			{isLoading ? (
				<span className="col-start-1 row-start-1 inline-flex animate-in justify-end delay-150 duration-0 fill-mode-both fade-in inline-full">
					<LoaderCircleIcon aria-hidden={true} className="animate-spin block-5 inline-5" />
					<span className="sr-only">{t("searching")}</span>
				</span>
			) : null}
			{hasData || !isLoading ? (
				<span className="col-start-1 row-start-1">{t("results-found", { count: pagination.total })}</span>
			) : null}
		</div>
	);
}
