import { env } from "#/configs/env.config.ts";

/** Use `{slug}` as a placeholder for the current entry's id. */
export function createPreviewUrl(previewUrl: string): string {
	if (env.NEXT_PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/enable?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}
