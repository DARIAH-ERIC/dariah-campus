import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { env } from "@/config/env.config";
import { createFullUrl } from "@/lib/navigation/create-full-url";

type AriaCurrentValue = ComponentProps<"a">["aria-current"];

interface UseNavLinkParams {
	"aria-current"?: AriaCurrentValue;
	href?: string;
}

interface UseNavLinkReturnValue {
	"aria-current"?: AriaCurrentValue;
}

export function useNavLink(params: UseNavLinkParams): UseNavLinkReturnValue {
	const { "aria-current": ariaCurrent, href } = params;

	const pathname = usePathname();

	if (ariaCurrent != null) {
		return {
			"aria-current": ariaCurrent,
		};
	}

	const isCurrent = isCurrentPage(href, pathname);

	return {
		"aria-current": isCurrent ? "page" : undefined,
	};
}

export function isCurrentPage(href: string | undefined, pathname: string): boolean {
	const url = createFullUrl({ pathname: href });

	const isCurrent = url.origin === env.NEXT_PUBLIC_APP_BASE_URL && url.pathname === pathname;

	return isCurrent;
}
