import type { ValueForReading } from "@keystatic/core";

import { createHref } from "@/lib/create-href";
import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "curricula": {
			return {
				href: createHref({
					pathname: `/curricula/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "documentation": {
			return {
				href: createHref({
					pathname: `/documentation/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "download": {
			return {
				download: true,
				href: params.value,
			};
		}

		case "external": {
			return {
				href: params.value,
			};
		}

		case "hash": {
			return {
				href: createHref({
					hash: params.value,
				}),
			};
		}

		case "resources-events": {
			return {
				href: createHref({
					pathname: `/resources/events/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "resources-external": {
			return {
				href: createHref({
					pathname: `/resources/external/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "resources-hosted": {
			return {
				href: createHref({
					pathname: `/resources/hosted/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "resources-pathfinders": {
			return {
				href: createHref({
					pathname: `/resources/pathfinders/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "search": {
			return {
				href: createHref({
					pathname: "/search",
					searchParams: params.value.search,
				}),
			};
		}
	}
}
