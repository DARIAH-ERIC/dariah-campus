import { cookies, draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";

export async function PreviewModeBanner(): Promise<ReactNode> {
	const t = await getTranslations("PreviewModeBanner");

	const draft = await draftMode();
	const isDraftModeEnabled = draft.isEnabled;

	if (!isDraftModeEnabled) {
		return null;
	}

	const cookieStore = await cookies();

	const branch = cookieStore.get("ks-branch")?.value;
	const token = cookieStore.get("keystatic-gh-access-token")?.value;

	return (
		<aside className="fixed inset-x-0 bottom-0 z-10 flex justify-between bg-amber-700 px-4 py-2 font-medium text-white">
			{t("enabled")} (
			{branch != null && token != null ? t("branch", { branch }) : t("invalid-branch")})
			<Link
				className="underline underline-offset-4 hover:no-underline"
				href="/api/preview/disable"
				prefetch={false}
			>
				{t("disable")}
			</Link>
		</aside>
	);
}
