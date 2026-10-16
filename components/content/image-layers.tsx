"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentPropsWithRef, Fragment, type ReactNode, useState } from "react";
import { Label, Slider, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";

import { getChildrenElements } from "#/components/content/get-children-elements.ts";
import { getImageMaxInlineSize } from "#/components/content/get-image-max-inline-size.ts";
import { Image } from "#/components/image.tsx";

interface ImageLayersProps {
	children: ReactNode;
	label?: string;
}

export function ImageLayers(props: Readonly<ImageLayersProps>): ReactNode {
	const { children, label } = props;

	const t = useTranslations("content.ImageLayers");

	/** Layers without image are ignored, because the cms allows inserting empty layers. */
	const layers = getChildrenElements<ImageLayerProps>(children).filter((layer) => isNonEmptyString(layer.props.src));

	const [index, setIndex] = useState(0);

	const maxIndex = Math.max(layers.length - 1, 0);
	/** The number of layers can change when content is edited in the cms preview. */
	const currentIndex = Math.min(index, maxIndex);

	function getLayerLabel(layer: (typeof layers)[number] | undefined, index: number): string {
		const label = layer?.props.label;

		return isNonEmptyString(label) ? label : t("layer-label", { index: String(index + 1) });
	}

	return (
		<figure className="my-4 flex flex-col gap-y-4">
			<div className="not-prose mx-auto grid justify-items-center overflow-hidden rounded-sm border border-neutral-200 inline-fit max-inline-full">
				{layers.map((layer, index) => {
					const { alt = "", height, src, width } = layer.props;

					const isVisible = index <= currentIndex;

					return (
						<Image
							key={String(index)}
							alt={alt}
							aria-hidden={!isVisible || undefined}
							className={cn(
								"object-contain transition-opacity [grid-area:1/-1] block-auto",
								isVisible ? "opacity-100" : "opacity-0",
							)}
							height={height}
							sizes="(max-width: 767px) 100vw, 720px"
							src={src}
							style={{ maxInlineSize: getImageMaxInlineSize(width, height) }}
							width={width}
						/>
					);
				})}
			</div>

			{layers.length > 1 ? (
				<Slider
					className="grid gap-y-2 text-sm"
					maxValue={maxIndex}
					minValue={0}
					onChange={setIndex}
					step={1}
					value={currentIndex}
				>
					<div className="flex flex-wrap items-baseline justify-between gap-x-4">
						<Label>{isNonEmptyString(label) ? label : t("label")}</Label>

						<SliderOutput className="text-neutral-600">
							{t("output", {
								index: String(currentIndex + 1),
								label: getLayerLabel(layers[currentIndex], currentIndex),
								total: String(layers.length),
							})}
						</SliderOutput>
					</div>

					<div className="flex items-center gap-x-3">
						<Button
							aria-disabled={currentIndex === 0}
							aria-label={t("fewer-layers")}
							onClick={() => {
								setIndex(Math.max(currentIndex - 1, 0));
							}}
						>
							<ChevronLeftIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
						</Button>

						<SliderTrack className="group relative flex flex-1 touch-none items-center block-6">
							{({ state }) => (
								<Fragment>
									<div className="absolute inset-s-0 rounded-full bg-neutral-200 block-1 inline-full" />

									<div
										className="absolute inset-s-0 rounded-full bg-neutral-800 block-1"
										style={{ inlineSize: `${String(state.getThumbPercent(0) * 100)}%` }}
									/>

									{layers.map((_layer, index) => {
										const percentage = (index / maxIndex) * 100;

										return (
											<div
												key={String(index)}
												className="absolute rounded-full bg-neutral-400 block-2 inline-0.5"
												style={{ insetInlineStart: `calc(${String(percentage)}% - 1px)` }}
											/>
										);
									})}

									<SliderThumb className="inset-bs-1/2 cursor-default rounded-full border border-neutral-300 bg-white shadow-sm transition block-5 inline-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800 dragging:bg-neutral-100" />
								</Fragment>
							)}
						</SliderTrack>

						<Button
							aria-disabled={currentIndex === maxIndex}
							aria-label={t("more-layers")}
							onClick={() => {
								setIndex(Math.min(currentIndex + 1, maxIndex));
							}}
						>
							<ChevronRightIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
						</Button>
					</div>
				</Slider>
			) : null}
		</figure>
	);
}

interface ButtonProps extends ComponentPropsWithRef<"button"> {
	children: ReactNode;
}

/**
 * Note that the buttons are never actually disabled, they are only marked as `aria-disabled`, so keyboard focus is not
 * lost when the first or last layer is reached.
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

interface ImageLayerProps {
	alt?: string;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	height?: number;
	label?: string;
	src: string;
	/** Maybe added by `with-image-sizes` mdx plugin. */
	width?: number;
}

export function ImageLayer(_props: Readonly<ImageLayerProps>): ReactNode {
	return null;
}
