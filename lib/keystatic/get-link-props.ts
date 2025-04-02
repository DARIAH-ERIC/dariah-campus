import type { ValueForReading } from "@keystatic/core";

import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "documentation": {
			return { href: `/documentation/${params.value}` };
		}

		case "download": {
			return { download: true, href: params.value };
		}

		case "external": {
			return { href: params.value };
		}

		case "url-fragment-id": {
			return { href: `#${params.value}` };
		}

		case "curricula": {
			return { href: `/curricula/${params.value}` };
		}

		case "resources-events": {
			return { href: `/resources/events/${params.value}` };
		}

		case "resources-external": {
			return { href: `/resources/external/${params.value}` };
		}

		case "resources-hosted": {
			return { href: `/resources/hosted/${params.value}` };
		}

		case "resources-pathfinders": {
			return { href: `/resources/pathfinders/${params.value}` };
		}
	}
}
