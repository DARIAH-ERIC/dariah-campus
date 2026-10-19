"use client";

import { lazy } from "react";

/**
 * Defer loading i18n functionality client-side until needed.
 *
 * @see https://next-intl-docs.vercel.app/docs/environments/error-files#errorjs
 */
const ErrorPage = lazy(() => import("#/app/(app)/(default)/error-page.tsx"));

export default ErrorPage;
