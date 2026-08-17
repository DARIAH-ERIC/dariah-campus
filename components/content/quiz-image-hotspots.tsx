"use client";

import { assert } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import { MapPinIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	Children,
	createContext,
	type CSSProperties,
	type ReactNode,
	use,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay, OverlayArrow, Popover } from "react-aria-components";
import { createPortal } from "react-dom";

import { useQuizContext } from "@/components/content/quiz";
import { QuizControls } from "@/components/content/quiz-controls";
import { Image } from "@/components/image";

type HotspotPresentation = "inline" | "popover" | "sidepanel";

interface HotspotContextValue {
	activeId: string | null;
	inlinePanel: HTMLElement | null;
	presentation: HotspotPresentation;
	select: (id: string | null) => void;
}

const HotspotContext = createContext<HotspotContextValue | null>(null);
const HotspotIndexContext = createContext(1);

interface QuizImageHotspotsProps {
	alt?: string;
	children: ReactNode;
	height?: number;
	presentation?: HotspotPresentation;
	src: string;
	width?: number;
}

export function QuizImageHotspots(props: Readonly<QuizImageHotspotsProps>): ReactNode {
	const { alt = "", children, height, presentation = "inline", src, width } = props;
	const { isCurrent } = useQuizContext();
	const t = useTranslations("content.QuizControls");
	const hotspotsT = useTranslations("content.QuizImageHotspots");
	const [activeId, setActiveId] = useState<string | null>(null);
	const [inlinePanel, setInlinePanel] = useState<HTMLElement | null>(null);
	const contextValue = useMemo(() => {
		return { activeId, inlinePanel, presentation, select: setActiveId };
	}, [activeId, inlinePanel, presentation]);
	// eslint-disable-next-line @eslint-react/no-children-map -- MDX supplies hotspots as opaque children; wrapping them preserves their elements while providing document order.
	const indexedHotspotChildren = Children.map(children, (child, index) => {
		return <HotspotIndexContext value={index + 1}>{child}</HotspotIndexContext>;
	});

	return (
		<section
			className="@container my-4 grid gap-y-4 rounded-md border border-neutral-200 bg-white px-4 py-6 text-sm/relaxed text-neutral-950 shadow-sm"
			hidden={!isCurrent}
		>
			<HotspotContext value={contextValue}>
				<div
					className={cn(
						"not-prose grid gap-4",
						presentation === "inline" ? "@[48rem]:grid-cols-[minmax(0,3fr)_minmax(16rem,2fr)]" : undefined,
					)}
				>
					<div className="relative isolate self-start overflow-hidden rounded-md">
						<Image alt={alt} className="h-auto w-full" height={height} src={src} width={width} />
						{indexedHotspotChildren}
					</div>

					{presentation === "inline" ? (
						<aside
							ref={setInlinePanel}
							aria-label={hotspotsT("inline-panel-label")}
							className={cn(
								"max-h-96 min-h-32 overflow-y-auto overscroll-contain rounded-md border border-neutral-200 bg-neutral-50 p-4",
								activeId == null ? "grid place-items-center" : undefined,
							)}
						>
							{activeId == null ? <p className="text-center text-neutral-600">{hotspotsT("select-hotspot")}</p> : null}
						</aside>
					) : null}
				</div>
			</HotspotContext>

			<QuizControls nextButtonLabel={t("next-question")} previousButtonLabel={t("previous-question")} />
		</section>
	);
}

interface QuizImageHotspotProps {
	children: ReactNode;
	label: string;
	x: number;
	y: number;
}

export function QuizImageHotspot(props: Readonly<QuizImageHotspotProps>): ReactNode {
	const { children, label, x, y } = props;
	const context = use(HotspotContext);
	assert(context != null);
	const hotspotIndex = use(HotspotIndexContext);
	const { activeId, inlinePanel, presentation, select } = context;
	const t = useTranslations("content.QuizImageHotspots");
	const resolvedLabel = label.trim() || t("hotspot-label", { index: String(hotspotIndex) });
	const id = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const isActive = activeId === id;
	const panelId = `${id}-panel`;
	const style = { "--hotspot-x": `${String(x)}%`, "--hotspot-y": `${String(y)}%` } as CSSProperties;

	if (presentation === "popover") {
		return (
			<DialogTrigger>
				<Button
					aria-label={resolvedLabel}
					className="absolute top-(--hotspot-y) left-(--hotspot-x) grid size-9 -translate-1/2 place-items-center rounded-full border-2 border-white bg-brand-700 text-white shadow-md outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 pressed:scale-95"
					style={style}
				>
					<MapPinIcon aria-hidden={true} className="size-5" />
				</Button>
				<Popover
					className="prose prose-sm max-h-[min(70vh,32rem)] w-80 max-w-[calc(100vw-2rem)] overflow-auto rounded-md border border-neutral-200 bg-white px-4 py-3 text-neutral-950 shadow-lg"
					offset={12}
				>
					<OverlayArrow className="group">
						<svg
							aria-hidden={true}
							className="block fill-white stroke-1 stroke-neutral-200 group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90"
							height={12}
							viewBox="0 0 12 12"
							width={12}
						>
							<path d="M0 0 L6 6 L12 0" />
						</svg>
					</OverlayArrow>
					<Dialog aria-label={resolvedLabel} className="outline-none">
						<p className="font-semibold">{resolvedLabel}</p>
						{children}
					</Dialog>
				</Popover>
			</DialogTrigger>
		);
	}

	if (presentation === "sidepanel") {
		return (
			<DialogTrigger>
				<Button
					aria-label={resolvedLabel}
					className="absolute top-(--hotspot-y) left-(--hotspot-x) grid size-9 -translate-1/2 place-items-center rounded-full border-2 border-white bg-brand-700 text-white shadow-md outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 pressed:scale-95"
					style={style}
				>
					<MapPinIcon aria-hidden={true} className="size-5" />
				</Button>
				<ModalOverlay className="fixed inset-0 z-50 bg-neutral-950/40" isDismissable={true}>
					<Modal className="fixed inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white text-neutral-950 shadow-2xl outline-none">
						<Dialog aria-label={resolvedLabel} className="min-h-full outline-none">
							<header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
								<h2 className="text-lg font-semibold">{resolvedLabel}</h2>
								<Button
									aria-label={t("close")}
									className="grid size-8 shrink-0 place-items-center rounded-md text-neutral-600 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-brand-700 pressed:bg-neutral-200"
									slot="close"
								>
									<XIcon aria-hidden={true} className="size-4" />
								</Button>
							</header>
							<div className="prose prose-sm max-w-none px-6 py-5">{children}</div>
						</Dialog>
					</Modal>
				</ModalOverlay>
			</DialogTrigger>
		);
	}

	return (
		<>
			<Button
				ref={triggerRef}
				aria-controls={panelId}
				aria-expanded={isActive}
				aria-label={resolvedLabel}
				className={cn(
					"absolute top-(--hotspot-y) left-(--hotspot-x) grid size-9 -translate-1/2 place-items-center rounded-full border-2 border-white bg-brand-700 text-white shadow-md outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 pressed:scale-95",
					isActive ? "scale-110 bg-brand-900 ring-2 ring-white" : undefined,
				)}
				onPress={() => {
					select(id);
				}}
				style={style}
			>
				<MapPinIcon aria-hidden={true} className="size-5" />
			</Button>
			{isActive && inlinePanel != null
				? createPortal(
						<section aria-label={resolvedLabel} className="prose prose-sm" id={panelId}>
							<header className="not-prose mb-3 flex items-start justify-between gap-3">
								<p className="font-semibold text-neutral-950">{resolvedLabel}</p>
								<Button
									aria-label={t("close")}
									className="grid size-8 shrink-0 place-items-center rounded-md text-neutral-600 outline-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-brand-700 pressed:bg-neutral-300"
									onPress={() => {
										select(null);
										triggerRef.current?.focus();
									}}
								>
									<XIcon aria-hidden={true} className="size-4" />
								</Button>
							</header>
							{children}
						</section>,
						inlinePanel,
					)
				: null}
		</>
	);
}
