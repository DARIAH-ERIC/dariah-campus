"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useSearch } from "#/app/(app)/(default)/search/_components/search-provider.tsx";

export function SearchStats(): ReactNode {
	const t = useTranslations("SearchPage");
	const { hasData, isLoading, pagination } = useSearch();

	return (
		<div className="mx-auto grid h-5 w-full place-items-center text-sm text-neutral-600" role="status">
			{isLoading ? (
				<span className="col-start-1 row-start-1 inline-flex w-full justify-end animate-in delay-150 duration-0 fill-mode-both fade-in">
					<LoaderCircleIcon aria-hidden={true} className="size-5 animate-spin" />
					<span className="sr-only">{t("searching")}</span>
				</span>
			) : null}
			{hasData || !isLoading ? (
				<span className="col-start-1 row-start-1">{t("results-found", { count: pagination.total })}</span>
			) : null}
		</div>
	);
}
