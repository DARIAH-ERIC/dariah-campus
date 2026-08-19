"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentPropsWithRef, type ReactNode, useCallback, useSyncExternalStore } from "react";

import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { Image } from "#/components/image.tsx";

interface CarouselProps {
	children: ReactNode;
	label?: string;
	/** @default false */
	loop?: boolean;
}

export function Carousel(props: Readonly<CarouselProps>): ReactNode {
	const { children, label, loop = false } = props;

	const t = useTranslations("content.Carousel");

	/** Slides without image are ignored, because the cms allows inserting empty slides. */
	const slides = getChildrenElements<CarouselItemProps>(children).filter((slide) =>
		isNonEmptyString(slide.props.src)
	);

	const [carouselRef, api] = useEmblaCarousel({ loop });

	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			api?.on("reInit", onStoreChange).on("select", onStoreChange);

			return () => {
				api?.off("reInit", onStoreChange).off("select", onStoreChange);
			};
		},
		[api],
	);

	const selectedIndex = useSyncExternalStore(
		subscribe,
		() => api?.selectedScrollSnap() ?? 0,
		() => 0,
	);
	const canScrollPrevious = useSyncExternalStore(
		subscribe,
		() => api?.canScrollPrev() ?? false,
		() => false,
	);
	const canScrollNext = useSyncExternalStore(
		subscribe,
		() => api?.canScrollNext() ?? false,
		() => false,
	);

	return (
		<div
			aria-label={isNonEmptyString(label) ? label : t("label")}
			aria-roledescription={t("carousel")}
			className="my-4 flex flex-col gap-y-4"
			role="group"
		>
			<div ref={carouselRef} className="overflow-hidden">
				<div className="-ms-4 flex">
					{slides.map((slide, index) => {
						const { alt = "", children, height, src, width } = slide.props;

						return (
							<div
								key={String(index)}
								aria-label={t("slide-label", { index: String(index + 1), total: String(slides.length) })}
								aria-roledescription={t("slide")}
								className="shrink-0 grow-0 basis-full ps-4 min-inline-0"
								role="group"
							>
								{/** The figure only takes up as much space as the image, so the caption aligns with it. */}
								<figure className="mx-auto my-0 flex flex-col inline-fit max-inline-full min-inline-[min(100%,20rem)]">
									<Image
										alt={alt}
										className="self-center object-contain block-auto inline-auto max-block-[min(60vh,32rem)] max-inline-full"
										height={height}
										src={src}
										width={width}
									/>

									<figcaption className="contain-inline-size **:first:mbs-0 **:last:mbe-0">{children}</figcaption>
								</figure>
							</div>
						);
					})}
				</div>
			</div>

			{slides.length > 1 ? (
				<div className="flex items-center justify-center gap-x-2">
					<Button
						aria-disabled={!canScrollPrevious}
						aria-label={t("previous-slide")}
						onClick={() => {
							api?.scrollPrev();
						}}
					>
						<ChevronLeftIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					</Button>

					<div aria-label={t("picker-label")} className="flex items-center gap-x-2" role="group">
						{slides.map((_slide, index) => {
							const isSelected = index === selectedIndex;

							return (
								<button
									key={String(index)}
									aria-disabled={isSelected}
									aria-label={t("picker-item-label", { index: String(index + 1) })}
									className={
										isSelected
											? "cursor-default rounded-full bg-neutral-800 transition block-2.5 inline-2.5"
											: "cursor-default rounded-full bg-neutral-300 transition block-2.5 inline-2.5 hover:bg-neutral-400"
									}
									onClick={() => {
										api?.scrollTo(index);
									}}
									type="button"
								/>
							);
						})}
					</div>

					<Button
						aria-disabled={!canScrollNext}
						aria-label={t("next-slide")}
						onClick={() => {
							api?.scrollNext();
						}}
					>
						<ChevronRightIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					</Button>
				</div>
			) : null}
		</div>
	);
}

interface ButtonProps extends ComponentPropsWithRef<"button"> {
	children: ReactNode;
}

/**
 * Note that the buttons are never actually disabled, they are only marked as `aria-disabled`, so keyboard
 * focus is not lost when the carousel reaches its first or last slide.
 */
function Button(props: Readonly<ButtonProps>): ReactNode {
	const { children } = props;

	return (
		<button
			{...props}
			className="inline-flex cursor-default items-center justify-center rounded-full border border-neutral-200 p-2 transition not-aria-disabled:hover:bg-neutral-100 not-aria-disabled:active:bg-neutral-200 aria-disabled:opacity-50"
			type="button"
		>
			{children}
		</button>
	);
}

interface CarouselItemProps {
	alt?: string;
	children: ReactNode;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	height?: number;
	src: string;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	width?: number;
}

export function CarouselItem(_props: Readonly<CarouselItemProps>): ReactNode {
	return null;
}
