import { createUrl } from "@acdh-oeaw/lib";
import type { MetadataRoute } from "next";

import { env } from "@/config/env.config";

const baseUrl = env.NEXT_PUBLIC_APP_PRODUCTION_BASE_URL;

export default function robots(): MetadataRoute.Robots {
	if (env.NEXT_PUBLIC_BOTS !== "enabled") {
		return {
			rules: {
				disallow: "/",
				userAgent: "*",
			},
		};
	}

	return {
		host: baseUrl,
		rules: {
			allow: "/",
			userAgent: "*",
		},
		sitemap: String(createUrl({ baseUrl, pathname: "/sitemap.xml" })),
	};
}
