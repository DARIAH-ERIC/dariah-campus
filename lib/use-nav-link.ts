import type { LinkProps } from "@/components/link";
import { env } from "@/config/env.config";
import { createFullUrl } from "@/lib/create-full-url";
import { usePathname } from "@/lib/i18n/navigation";

interface UseNavLinkParams extends Pick<LinkProps, "aria-current" | "href"> {}

interface UseNavLinkReturnValue extends Pick<LinkProps, "aria-current"> {}

export function useNavLink(params: UseNavLinkParams): UseNavLinkReturnValue {
	const { "aria-current": ariaCurrent, href } = params;

	const pathname = usePathname();

	if (ariaCurrent != null) {
		return {
			"aria-current": ariaCurrent,
		};
	}

	const url = createFullUrl({ pathname: href });
	const isCurrent = url.origin === env.NEXT_PUBLIC_APP_BASE_URL && url.pathname === pathname;

	return {
		"aria-current": isCurrent ? "page" : undefined,
	};
}
