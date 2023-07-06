import { type ComponentPropsWithoutRef } from "react";

import { consentStore } from "@/analytics/useConsent";

/**
 * Button to opt-out of analytics service.
 */
export function OptOutButton(props: ComponentPropsWithoutRef<"button">): JSX.Element {
	function decline() {
		consentStore.set("rejected");
	}

	return (
		<button {...props} onClick={decline}>
			{props.children}
		</button>
	);
}
