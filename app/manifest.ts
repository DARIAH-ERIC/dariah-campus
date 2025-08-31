import type { MetadataRoute } from "next";

import { defaultLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const meta = await getMetadata(defaultLocale);

	return {
		name: meta.manifest.name,
		short_name: meta.manifest["short-name"],
		description: meta.manifest.description,
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#fff",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
			{
				src: "/icon-maskable.svg",
				sizes: "any",
				type: "image/svg+xml",
				purpose: "maskable",
			},
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
