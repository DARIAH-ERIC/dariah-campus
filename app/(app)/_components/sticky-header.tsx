"use client";

/**
 * Once firefox ans safari land support, we should use scroll-driven animation,
 * so this does not have to be a client component.
 *
 * @see https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/
 */

import { cn } from "@acdh-oeaw/style-variants";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";

interface StickyHeaderProps {
	children: ReactNode;
}

export function StickyHeader(props: StickyHeaderProps): ReactNode {
	const { children } = props;

	const ref = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);

	useEffect(() => {
		if (ref.current == null) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(Boolean(entry?.isIntersecting));
			},
			{ rootMargin: "-50px 0px 0px 0px" },
		);

		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<Fragment>
			<div ref={ref} className="absolute top-32" data-sentinel={true}></div>
			<header
				className={cn(
					"sticky top-0 z-10 flex items-baseline justify-between gap-x-8 bg-neutral-50 px-4 py-6 xs:px-8",
					!isIntersecting && "shadow",
				)}
			>
				{children}
			</header>
		</Fragment>
	);
}
