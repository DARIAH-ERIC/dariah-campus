import { createUrl } from "@acdh-oeaw/lib";
import type { MetadataRoute } from "next";

import { env } from "@/config/env.config";

export default function robots(): MetadataRoute.Robots {
	if (env.NEXT_PUBLIC_BOTS !== "enabled") {
		return {
			host: env.NEXT_PUBLIC_APP_BASE_URL,
			rules: {
				disallow: "/",
				userAgent: "*",
			},
		};
	}

	return {
		host: env.NEXT_PUBLIC_APP_BASE_URL,
		rules: {
			allow: "/",
			userAgent: "*",
		},
		sitemap: String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: "/sitemap.xml" })),
	};
}
