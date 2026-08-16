"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useSearch } from "@/app/(app)/(default)/search/_components/search-provider";

export function SearchStats(): ReactNode {
	const t = useTranslations("SearchPage");
	const { found, isLoading } = useSearch();

	return (
		<div className="mx-auto flex h-5 items-center text-sm text-neutral-600" role="status">
			{isLoading ? (
				<span className="inline-flex">
					<LoaderCircleIcon aria-hidden={true} className="size-5 animate-spin" />
					<span className="sr-only">{t("searching")}</span>
				</span>
			) : (
				<span>{t("results-found", { count: found })}</span>
			)}
		</div>
	);
}
