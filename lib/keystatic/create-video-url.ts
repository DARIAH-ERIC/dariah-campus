import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import type { VideoProvider } from "@/lib/content/options";

export function createVideoUrl(
	provider: VideoProvider,
	id: string,
	startTime?: number | null,
): URL {
	switch (provider) {
		case "nakala": {
			return createUrl({
				baseUrl: "https://api.nakala.fr",
				pathname: `/embed/${id}`,
			});
		}

		case "uni-helsinki": {
			return createUrl({
				baseUrl: "https://unitube.it.helsinki.fi",
				pathname: "/unitube/",
				searchParams: createUrlSearchParams({ id }),
			});
		}

		case "vimeo": {
			return createUrl({
				baseUrl: "https://player.vimeo.com",
				pathname: `/video/${id}`,
				hash: startTime ? `t=${String(startTime)}s` : undefined,
			});
		}

		case "youtube": {
			return createUrl({
				baseUrl: "https://www.youtube-nocookie.com",
				pathname: `/embed/${id}`,
				searchParams: startTime ? createUrlSearchParams({ start: startTime }) : undefined,
			});
		}
	}
}
