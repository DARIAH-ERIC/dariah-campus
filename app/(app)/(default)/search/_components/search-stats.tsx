"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useSearch } from "@/app/(app)/(default)/search/_components/search-provider";

export function SearchStats(): ReactNode {
	const t = useTranslations("SearchPage");
	const { found, hasData, isLoading } = useSearch();

	return (
		<div
			className="mx-auto grid h-5 w-full grid-cols-[1fr_auto_1fr] items-center text-sm text-neutral-600"
			role="status"
		>
			{isLoading ? (
				<span className="col-start-3 ml-2 inline-flex justify-self-start animate-in delay-150 duration-0 fill-mode-both fade-in">
					<LoaderCircleIcon aria-hidden={true} className="size-5 animate-spin" />
					<span className="sr-only">{t("searching")}</span>
				</span>
			) : null}
			{hasData || !isLoading ? (
				<span className="col-start-2">{t("results-found", { count: found })}</span>
			) : null}
		</div>
	);
}
