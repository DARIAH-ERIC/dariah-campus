"use client";

import { useEffect, useState } from "react";

export function useTableOfContentsHighlight(): string | undefined {
	const [firstHeadingInViewport, setFirstHeadingInViewport] = useState<string | undefined>();

	// tmp fix: should be queried instead of hardcoded
	const topOffset = 96;

	useEffect(() => {
		const controller = new AbortController();

		function getFirstHeadingInViewport() {
			const headings = Array.from(document.querySelectorAll("article :is(h2, h3, h4, h5)"));

			const firstHeadingInViewport =
				headings.find((heading) => {
					return heading.getBoundingClientRect().top >= topOffset;
				}) ?? headings[headings.length - 1];

			if (firstHeadingInViewport?.tagName === "H5") {
				const headingIndex = headings.indexOf(firstHeadingInViewport);
				const parentHeading = headings.slice(0, headingIndex).findLast((heading) => {
					return heading.matches(":is(h2, h3, h4)");
				});

				setFirstHeadingInViewport(parentHeading?.id);
			} else {
				setFirstHeadingInViewport(firstHeadingInViewport?.id);
			}
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
