import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { capitalize, isNonEmptyString } from "@acdh-oeaw/lib";
import { cn, styles } from "@acdh-oeaw/style-variants";
import { NotEditable, type ParsedValueForComponentSchema } from "@keystatic/core";
import {
	AlertTriangleIcon,
	BoltIcon,
	ChevronDownIcon,
	InfoIcon,
	LightbulbIcon,
	type LucideIcon,
	PencilIcon,
	PlayCircleIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type {
	CalloutKind,
	FigureAlignment,
	GridAlignment,
	GridLayout,
	VideoProvider,
} from "@/lib/content/options";
import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";

type LinkSchema = ParsedValueForComponentSchema<ReturnType<typeof createLinkSchema>>;

const calloutIcons: Record<Exclude<CalloutKind, "none">, LucideIcon> = {
	caution: BoltIcon,
	important: InfoIcon,
	note: PencilIcon,
	tip: LightbulbIcon,
	warning: AlertTriangleIcon,
};

const calloutStyles = styles({
	base: "grid gap-y-3 rounded-md border p-6 shadow [&_*::marker]:text-inherit [&_*]:text-inherit",
	variants: {
		kind: {
			caution: "border-l-4 border-error-200 border-l-error-600 bg-error-50 text-error-800",
			important:
				"border-l-4 border-important-200 border-l-important-600 bg-important-50 text-important-800",
			note: "border-l-4 border-neutral-200 border-l-neutral-600 bg-neutral-100 text-neutral-800",
			tip: "border-l-4 border-success-200 border-l-success-600 bg-success-50 text-success-800",
			warning: "border-l-4 border-warning-200 border-l-warning-500 bg-warning-50 text-warning-800",
			none: "border-neutral-200 bg-neutral-100 text-neutral-800",
		},
	},
	defaults: {
		kind: "note",
	},
});

interface CalloutPreviewProps {
	children: ReactNode;
	/** @default "note" */
	kind?: CalloutKind;
	title?: string;
}

export function CalloutPreview(props: Readonly<CalloutPreviewProps>): ReactNode {
	const { children, kind = "note", title } = props;

	return (
		<aside className={calloutStyles({ kind })}>
			<NotEditable>
				<CalloutPreviewHeader kind={kind} title={title} />
			</NotEditable>
			<div className="[&_a:hover]:no-underline [&_a]:underline">{children}</div>
		</aside>
	);
}

interface CalloutPreviewHeaderProps {
	kind: CalloutKind;
	title?: string;
}

function CalloutPreviewHeader(props: CalloutPreviewHeaderProps): ReactNode {
	const { kind, title } = props;

	const hasTitle = isNonEmptyString(title);

	if (kind !== "none") {
		const Icon = calloutIcons[kind];

		return (
			<strong className="flex items-center gap-x-2 font-bold">
				<Icon aria-hidden={true} className="size-5 shrink-0" />
				<span>{hasTitle ? title : capitalize(kind)}</span>
			</strong>
		);
	}

	if (hasTitle) {
		return <strong className="font-bold">{title}</strong>;
	}

	return null;
}

interface DiagramPreviewProps {
	children: ReactNode;
}

export function DiagramPreview(props: Readonly<DiagramPreviewProps>): ReactNode {
	const { children } = props;

	return <figure>{children}</figure>;
}

interface DiagramCaptionPreviewProps {
	children: ReactNode;
}

export function DiagramCaptionPreview(props: Readonly<DiagramCaptionPreviewProps>): ReactNode {
	const { children } = props;

	return <figcaption className="text-sm">{children}</figcaption>;
}

interface DiagramCodeBlockPreviewProps {
	children: ReactNode;
}

export function DiagramCodeBlockPreview(props: Readonly<DiagramCodeBlockPreviewProps>): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}

interface DisclosurePreviewProps {
	children: ReactNode;
	title: string;
}

export function DisclosurePreview(props: Readonly<DisclosurePreviewProps>): ReactNode {
	const { children, title } = props;

	return (
		<details className="group my-4 grid border-y open:pb-4" open={true}>
			<summary className="my-3 inline-flex cursor-pointer list-none py-1 font-bold group-open:pb-0 hover:underline focus:outline-none">
				<NotEditable className="inline-flex flex-1 items-center justify-between gap-x-4">
					<span>{title || "(Disclosure title)"}</span>
					<ChevronDownIcon
						aria-hidden={true}
						className="size-5 shrink-0 text-neutral-500 transition group-open:rotate-180"
					/>
				</NotEditable>
			</summary>
			<div className="[&_:first-child]:mt-0 [&_:last-child]:mb-0 [&_a:hover]:no-underline [&_a]:underline">
				{children}
			</div>
		</details>
	);
}

interface EmbedPreviewProps {
	children?: ReactNode;
	src: string | null;
}

export function EmbedPreview(props: Readonly<EmbedPreviewProps>): ReactNode {
	const { children, src } = props;

	return (
		<figure className="grid gap-y-2">
			<NotEditable>
				{src != null ? (
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="aspect-square w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
						loading="lazy"
						src={src}
					/>
				) : null}
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}

interface ExternalResourcePreviewProps {
	subtitle: string;
	title: string;
}

export function ExternalResourcePreview(props: Readonly<ExternalResourcePreviewProps>): ReactNode {
	const { subtitle, title } = props;

	return (
		<NotEditable>
			<aside className="my-4 grid place-items-center justify-center gap-y-2 text-center text-neutral-800">
				<strong className="text-2xl font-bold">{title}</strong>
				<div className="text-neutral-500">{subtitle}</div>
				<div className="mt-2 inline-flex select-none rounded-full bg-brand-700 px-4 py-2 font-medium leading-7 text-white no-underline transition hover:bg-brand-900 focus:outline-none focus-visible:ring focus-visible:ring-brand-700">
					{"Go to this resource"}
				</div>
			</aside>
		</NotEditable>
	);
}

interface FigurePreviewProps {
	/** @default "stretch" */
	alignment?: FigureAlignment;
	alt?: string;
	children?: ReactNode;
	src: UseObjectUrlParams | null;
}

export function FigurePreview(props: Readonly<FigurePreviewProps>): ReactNode {
	const { alignment = "stretch", alt = "", children, src } = props;

	const url = useObjectUrl(src);

	return (
		<figure className={cn("grid gap-y-2", alignment === "center" ? "justify-center" : undefined)}>
			<NotEditable>
				{url != null ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						alt={alt}
						className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
						src={url}
					/>
				) : null}
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}

const gridStyles = styles({
	base: "grid content-start gap-x-8",
	variants: {
		alignment: {
			center: "items-center",
			stretch: "",
		},
		layout: {
			"two-columns": "sm:grid-cols-2",
			"three-columns": "sm:grid-cols-3",
			"four-columns": "sm:grid-cols-4",
			"one-two-columns": "sm:grid-cols-[1fr_2fr]",
			"one-three-columns": "sm:grid-cols-[1fr_3fr]",
			"one-four-columns": "sm:grid-cols-[1fr_4fr]",
		},
	},
	defaults: {
		alignment: "stretch",
		layout: "two-columns",
	},
});

interface GridPreviewProps {
	/** @default "stretch" */
	alignment?: GridAlignment;
	children: ReactNode;
	/** @default "two-columns" */
	layout: GridLayout;
}

export function GridPreview(props: Readonly<GridPreviewProps>): ReactNode {
	const { alignment = "stretch", children, layout = "two-columns" } = props;

	return <div className={gridStyles({ alignment, layout })}>{children}</div>;
}

interface GridItemPreviewProps {
	/** @default "stretch" */
	alignment?: GridAlignment;
	children: ReactNode;
}

export function GridItemPreview(props: Readonly<GridItemPreviewProps>): ReactNode {
	const { alignment = "stretch", children } = props;

	return <div className={alignment === "center" ? "self-center" : undefined}>{children}</div>;
}

interface HeadingIdPreviewProps {
	children: ReactNode;
}

export function HeadingIdPreview(props: Readonly<HeadingIdPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<NotEditable className="inline">
			<span className="border-neutral-200 bg-neutral-100 px-2 text-neutral-700 opacity-50">
				{"#"}
				{children}
			</span>
		</NotEditable>
	);
}

interface LinkButtonPreviewProps {
	children: ReactNode;
	link: LinkSchema;
}

export function LinkButtonPreview(props: Readonly<LinkButtonPreviewProps>): ReactNode {
	const { children, link: _link } = props;

	return (
		<div className="inline-flex select-none rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white">
			{children}
		</div>
	);
}

interface QuizPreviewProps {
	children: ReactNode;
}

export function QuizPreview(props: Readonly<QuizPreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoicePreviewProps {
	buttonLabel?: string;
	children: ReactNode;
	variant: "single" | "multiple";
}

export function QuizChoicePreview(props: Readonly<QuizChoicePreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizChoiceAnswerPreviewProps {
	children: ReactNode;
	kind: "correct" | "incorrect";
}

export function QuizChoiceAnswerPreview(props: Readonly<QuizChoiceAnswerPreviewProps>): ReactNode {
	const { children, kind } = props;

	return (
		<div>
			<NotEditable>
				{/* eslint-disable-next-line react/jsx-no-literals */}
				{kind === "correct" ? "Correct" : "Incorrect"} answer:
			</NotEditable>
			{children}
		</div>
	);
}

interface QuizChoiceQuestionPreviewProps {
	children: ReactNode;
}

export function QuizChoiceQuestionPreview(
	props: Readonly<QuizChoiceQuestionPreviewProps>,
): ReactNode {
	const { children } = props;

	return children;
}

interface QuizErrorMessagePreviewProps {
	children: ReactNode;
}

export function QuizErrorMessagePreview(props: Readonly<QuizErrorMessagePreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface QuizSuccessMessagePreviewProps {
	children: ReactNode;
}

export function QuizSuccessMessagePreview(
	props: Readonly<QuizSuccessMessagePreviewProps>,
): ReactNode {
	const { children } = props;

	return children;
}

interface QuizTextInputPreviewProps {
	children: ReactNode;
}

export function QuizTextInputPreview(props: Readonly<QuizTextInputPreviewProps>): ReactNode {
	const { children } = props;

	return children;
}

interface TableOfContentsPreviewProps {
	title?: string;
}

export function TableOfContentsPreview(props: Readonly<TableOfContentsPreviewProps>): ReactNode {
	const { title = "Table of contents" } = props;

	return (
		<div className="grid gap-y-2">
			<strong className="font-bold">{title}</strong>
			{/* eslint-disable-next-line react/jsx-no-literals */}
			<div>Will be generated at build time.</div>
		</div>
	);
}

interface TabsPreviewProps {
	children: ReactNode;
}

export function TabsPreview(props: Readonly<TabsPreviewProps>): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}

interface TabPreviewProps {
	children: ReactNode;
	title: string;
}

export function TabPreview(props: Readonly<TabPreviewProps>): ReactNode {
	const { children, title } = props;

	return (
		<div className="grid gap-y-2 text-sm">
			<strong className="font-bold">{isNonEmptyString(title) ? title : "(No title)"}</strong>
			<div>{children}</div>
		</div>
	);
}

interface VideoPreviewProps {
	children?: ReactNode;
	id: string;
	provider: VideoProvider;
	startTime?: number | null;
}

export function VideoPreview(props: Readonly<VideoPreviewProps>): ReactNode {
	const { children, id, provider, startTime } = props;

	const href = isNonEmptyString(id) ? String(createVideoUrl(provider, id, startTime)) : null;

	return (
		<figure className="grid gap-y-2">
			<NotEditable>
				{href != null ? (
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="aspect-video w-full overflow-hidden rounded-lg border border-neutral-200"
						loading="lazy"
						src={href}
					/>
				) : null}
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}

interface VideoCardPreviewProps {
	id: string;
	image: UseObjectUrlParams | null;
	provider: VideoProvider;
	startTime?: number | null;
	subtitle?: string;
	title: string;
}

export function VideoCardPreview(props: Readonly<VideoCardPreviewProps>): ReactNode {
	const { id, image, provider, startTime, subtitle, title } = props;

	const href = isNonEmptyString(id) ? String(createVideoUrl(provider, id, startTime)) : null;
	const _src = useObjectUrl(image);

	return (
		<figure className="rounded-xl border border-neutral-200 bg-white text-neutral-800 shadow-md">
			<NotEditable className="grid gap-y-6 p-6">
				{href != null ? (
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="aspect-video w-full overflow-hidden rounded-lg border border-neutral-200"
						loading="lazy"
						src={href}
					/>
				) : null}
				<figcaption className="grid justify-center justify-items-center gap-y-1">
					<PlayCircleIcon aria-hidden={true} className="mx-auto size-12 shrink-0 text-brand-700" />
					<strong className="text-xl font-bold">{title}</strong>
					<div className="text-sm text-neutral-500">{subtitle}</div>
				</figcaption>
			</NotEditable>
		</figure>
	);
}
