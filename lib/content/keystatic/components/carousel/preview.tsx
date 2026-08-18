import type { ReactNode } from "react";

interface CarouselPreviewProps {
	children: ReactNode;
}

export function CarouselPreview(props: Readonly<CarouselPreviewProps>): ReactNode {
	const { children } = props;

	return <div className="grid gap-y-3">{children}</div>;
}

interface CarouselItemPreviewProps {
	children: ReactNode;
}

export function CarouselItemPreview(props: Readonly<CarouselItemPreviewProps>): ReactNode {
	const { children } = props;

	return <div className="rounded-sm border border-neutral-200 px-3 text-sm">{children}</div>;
}
