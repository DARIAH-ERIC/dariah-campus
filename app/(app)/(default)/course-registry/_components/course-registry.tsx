"use client";

import { type ReactNode, useState } from "react";

import { LoadingIndicator } from "#/components/loading-indicator.tsx";

export function CourseRegistry(): ReactNode {
	const [isLoading, setIsLoading] = useState(true);

	function onLoad() {
		setIsLoading(false);
	}

	return (
		<div className="relative min-block-[calc(100dvh-100px)]">
			{isLoading ? (
				<div className="absolute inset-0 grid place-content-center">
					<LoadingIndicator />
				</div>
			) : null}
			<iframe
				className="relative block-full inline-full"
				loading="lazy"
				onLoad={onLoad}
				src="https://dhcr.clarin-dariah.eu?parent_domain=dariah.eu"
				title="Course registry"
			/>
		</div>
	);
}
