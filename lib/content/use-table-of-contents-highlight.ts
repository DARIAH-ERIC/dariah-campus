"use client";

import { useEffect, useState } from "react";

export function useTableOfContentsHighlight(): string | undefined {
	const [firstHeadingInViewport, setFirstHeadingInViewport] = useState<string | undefined>();

	const topOffset = 0;

	useEffect(() => {
		const controller = new AbortController();

		function getFirstHeadingInViewport() {
			const headings = Array.from(document.querySelectorAll("article :is(h2, h3, h4)"));

			const firstHeadingInViewport =
				headings.find((heading) => {
					return heading.getBoundingClientRect().top >= topOffset;
				}) ?? headings[headings.length - 1];

			setFirstHeadingInViewport(firstHeadingInViewport?.id);
		}

		getFirstHeadingInViewport();

		document.addEventListener("resize", getFirstHeadingInViewport, {
			passive: true,
			signal: controller.signal,
		});
		document.addEventListener("scroll", getFirstHeadingInViewport, {
			passive: true,
			signal: controller.signal,
		});

		return () => {
			controller.abort();
		};
	}, []);

	return firstHeadingInViewport;
}
