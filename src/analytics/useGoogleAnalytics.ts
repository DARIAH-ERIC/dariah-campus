import { useRouter } from "next/router";
import { useEffect } from "react";

import { service } from "@/analytics/service";

/**
 * Registers client side route transitions with an analytics service.
 */
export function useGoogleAnalytics(): void {
	const router = useRouter();

	useEffect(() => {
		router.events.on("routeChangeComplete", service.registerPageView);

		return () => {
			router.events.off("routeChangeComplete", service.registerPageView);
		};
	}, [router.events]);
}
