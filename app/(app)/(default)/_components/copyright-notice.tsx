import { connection } from "next/server";
import type { ReactNode } from "react";

import { getMetadata } from "@/lib/i18n/metadata";

export async function CopyrightNotice(): Promise<ReactNode> {
	/** Ensure `new Date()` is computed at request time. */
	await connection();

	const meta = await getMetadata();

	return (
		<span>
			&copy; {new Date().getUTCFullYear()} {meta.creator}
		</span>
	);
}
