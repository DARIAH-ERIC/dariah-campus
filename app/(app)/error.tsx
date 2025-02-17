"use client";

import { lazy } from "react";

/**
 * Defer loading i18n functionality client-side until needed.
 *
 * @see https://next-intl-docs.vercel.app/docs/environments/error-files#errorjs
 */
export default lazy(async () => {
	return import("@/app/(app)/internal-error");
});
