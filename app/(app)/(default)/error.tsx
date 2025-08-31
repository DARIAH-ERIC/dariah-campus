"use client";

import { lazy } from "react";

/**
 * Defer loading i18n functionality client-side until needed.
 *
 * @see https://next-intl-docs.vercel.app/docs/environments/error-files#errorjs
 */
const ErrorPage = lazy(() => {
	return import("@/app/(app)/(default)/error-page");
});

export default ErrorPage;
