"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, PrinterIcon, RotateCcwIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	Input,
	Label,
	ProgressBar,
	Text,
	TextArea,
	TextField,
} from "react-aria-components";

import { createWorksheetDocument } from "#/components/content/create-worksheet-document.ts";
import { serializeRichText } from "#/components/content/serialize-rich-text.ts";
import { useMetadata } from "#/lib/i18n/metadata.ts";

export interface WorksheetQuestionData {
	description?: string;
	label: string;
	placeholder?: string;
	variant: "long" | "short";
}

export interface WorksheetSectionData {
	description: ReactNode;
	hasDescription: boolean;
	questions: Array<WorksheetQuestionData>;
	title?: string;
}

type Values = Record<string, string>;

/** Answers are keyed by position, so they survive editing a prompt's wording, but not reordering questions. */
function createAnswerKey(sectionIndex: number, questionIndex: number): string {
	return `${String(sectionIndex)}.${String(questionIndex)}`;
}

/**
 * Answers are scoped to the page, so the same widget can be reused across resources, and to the document title, so a
 * page can contain more than one form.
 */
function createStorageKey(title: string): string {
	return ["dariah-campus", "worksheet", window.location.pathname, title].join(":");
}

function createFileName(title: string): string {
	const slug = title
		.toLowerCase()
		.replaceAll(/[^\da-z]+/gu, "-")
		.replaceAll(/^-|-$/gu, "");

	return `${isNonEmptyString(slug) ? slug : "document"}.doc`;
}

interface WorksheetFormProps {
	description: ReactNode;
	/** Whether `description` has content, which cannot be determined from a `ReactNode`. */
	hasDescription: boolean;
	sections: Array<WorksheetSectionData>;
	title?: string;
}

/**
 * The interactive half of `Worksheet`. Splitting the sections and questions out of the rich-text children happens in
 * the server component, so components can be identified by comparing `child.type`.
 */
export function WorksheetForm(props: Readonly<WorksheetFormProps>): ReactNode {
	const { description, hasDescription, sections, title } = props;

	const t = useTranslations("content.Worksheet");
	const { dateTime } = useFormatter();
	const locale = useLocale();
	const meta = useMetadata();

	const id = useId();

	/** Required in the cms, but the cms saves entries with empty required fields. */
	const documentTitle = isNonEmptyString(title) ? title : t("title");

	/**
	 * Rich text is serialised out of the dom for the downloadable document, so every step stays mounted, and inactive
	 * ones are only hidden.
	 */
	const descriptionRef = useRef<HTMLDivElement | null>(null);
	const sectionDescriptionRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

	/**
	 * A step is a page of the form, so navigating moves focus to the new step, like following a link does. Otherwise the
	 * new questions sit _before_ the buttons in the document, and keyboard users would have to tab backwards to reach
	 * them - and screen readers would not announce that anything changed.
	 */
	const stepRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
	/** Comparing against the previous step keeps focus untouched on the initial render. */
	const previousIndex = useRef(0);

	/**
	 * Answers are only read from storage after mount, so server and client render the same empty form. Both values live
	 * in one state, so restoring them does not trigger a second render.
	 */
	const [state, setState] = useState<{ isRestored: boolean; values: Values }>({
		isRestored: false,
		values: {},
	});
	const { isRestored, values } = state;
	const [index, setIndex] = useState(0);
	const [isConfirmingReset, setIsConfirmingReset] = useState(false);

	/** The last step summarises the answers and offers the downloads. */
	const lastIndex = sections.length;
	/** The number of sections can change when content is edited in the cms preview. */
	const currentIndex = Math.min(index, lastIndex);
	/** Section titles are required in the cms, but the cms saves entries with empty required fields. */
	const sectionTitles = sections.map((section, index) =>
		isNonEmptyString(section.title) ? section.title : t("section-label", { index: String(index + 1) }),
	);

	/**
	 * Answers are persisted in `localStorage`, which can only be read after hydration, so restoring them necessarily
	 * happens in an effect.
	 */
	useEffect(() => {
		let restored: Values = {};

		try {
			const stored = window.localStorage.getItem(createStorageKey(documentTitle));

			if (stored != null) {
				const parsed = JSON.parse(stored) as unknown;

				if (typeof parsed === "object" && parsed != null) {
					restored = parsed as Values;
				}
			}
		} catch {
			/** Ignore unavailable or corrupted storage, the form still works without it. */
		}

		// oxlint-disable-next-line react/set-state-in-effect -- Restore persisted form state after hydration.
		setState({ isRestored: true, values: restored });
	}, [documentTitle]);

	useEffect(() => {
		if (!isRestored) {
			return;
		}

		try {
			const key = createStorageKey(documentTitle);

			if (Object.keys(values).length === 0) {
				window.localStorage.removeItem(key);
			} else {
				window.localStorage.setItem(key, JSON.stringify(values));
			}
		} catch {
			/** Ignore unavailable storage or an exceeded quota. */
		}
	}, [documentTitle, isRestored, values]);

	useEffect(() => {
		if (previousIndex.current !== currentIndex) {
			stepRefs.current.get(currentIndex)?.focus();
		}

		previousIndex.current = currentIndex;
	}, [currentIndex]);

	function createDocument(): string {
		return createWorksheetDocument({
			brand: meta.title,
			descriptionHtml: serializeRichText(descriptionRef.current),
			labels: {
				emptyAnswer: t("not-answered"),
				generated: t("generated", { date: dateTime(new Date(), { dateStyle: "long" }) }),
				source: t("source"),
			},
			language: locale,
			sections: sections.map((section, sectionIndex) => {
				return {
					descriptionHtml: serializeRichText(sectionDescriptionRefs.current.get(sectionIndex)),
					questions: section.questions.map((question, questionIndex) => {
						return {
							label: question.label,
							value: values[createAnswerKey(sectionIndex, questionIndex)] ?? "",
						};
					}),
					title: sectionTitles[sectionIndex] ?? "",
				};
			}),
			source: { title: document.title, url: window.location.href },
			title: documentTitle,
		});
	}

	function download(): void {
		const url = URL.createObjectURL(
			/** The byte order mark makes word detect the encoding of the html document. */
			new Blob(["\uFEFF", createDocument()], { type: "application/msword" }),
		);

		const link = document.createElement("a");
		link.download = createFileName(documentTitle);
		link.href = url;
		document.body.append(link);
		link.click();
		link.remove();

		/** Revoking synchronously can cancel the download in some browsers. */
		window.setTimeout(() => {
			URL.revokeObjectURL(url);
		}, 10_000);
	}

	function print(): void {
		/** Printing an iframe avoids the popup blocker, and reuses the styles of the downloaded document. */
		const iframe = document.createElement("iframe");
		iframe.setAttribute("aria-hidden", "true");
		iframe.setAttribute("tabindex", "-1");
		iframe.setAttribute("title", documentTitle);
		iframe.style.cssText = "position:fixed;inset:0;block-size:0;inline-size:0;border:0;";
		iframe.srcdoc = createDocument();

		iframe.addEventListener("load", () => {
			const frame = iframe.contentWindow;

			if (frame == null) {
				iframe.remove();
				return;
			}

			frame.addEventListener("afterprint", () => {
				iframe.remove();
			});

			frame.focus();
			frame.print();

			/** Not every browser fires `afterprint`, so the iframe is removed eventually in any case. */
			window.setTimeout(() => {
				iframe.remove();
			}, 60_000);
		});

		document.body.append(iframe);
	}

	function reset(): void {
		setState((state) => {
			return { ...state, values: {} };
		});
		setIndex(0);
		setIsConfirmingReset(false);
	}

	return (
		<section
			aria-labelledby={id}
			className="not-prose my-6 overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-sm"
		>
			<header className="border-be border-neutral-200 px-4 pbs-5 pbe-4 sm:px-6">
				<strong className="text-lg/tight font-bold" id={id}>
					{documentTitle}
				</strong>

				{hasDescription ? (
					<div
						ref={descriptionRef}
						className="mbs-2 text-sm/relaxed text-neutral-600 **:first:mbs-0 **:last:mbe-0 [&_a]:underline"
					>
						{description}
					</div>
				) : null}
			</header>

			<ProgressBar
				aria-label={t("progress-label")}
				className="border-be border-neutral-200 px-4 py-3 sm:px-6"
				maxValue={lastIndex + 1}
				minValue={0}
				value={currentIndex + 1}
			>
				{({ percentage }) => (
					<div className="grid gap-y-2">
						<div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-neutral-600">
							<span>{t("step-label", { index: String(currentIndex + 1), total: String(lastIndex + 1) })}</span>

							<span>{currentIndex === lastIndex ? t("summary") : sectionTitles[currentIndex]}</span>
						</div>

						<div className="overflow-hidden rounded-full bg-neutral-200 block-1.5">
							<div
								className="rounded-full bg-brand-600 transition-[inline-size] block-full"
								style={{ inlineSize: `${String(percentage ?? 0)}%` }}
							/>
						</div>
					</div>
				)}
			</ProgressBar>

			<form
				className="px-4 py-5 sm:px-6"
				onSubmit={(event) => {
					/** There is nothing to submit, the answers never leave the browser. */
					event.preventDefault();
				}}
			>
				{/** Every step stays mounted, so the rich text of all sections is available in the dom when the document is generated. */}
				{sections.map((section, sectionIndex) => (
					<Step
						key={String(sectionIndex)}
						descriptionRef={(node) => {
							sectionDescriptionRefs.current.set(sectionIndex, node);
						}}
						isCurrent={sectionIndex === currentIndex}
						id={`${id}-step-${String(sectionIndex)}`}
						ref={(node) => {
							stepRefs.current.set(sectionIndex, node);
						}}
						onChange={(key, value) => {
							setState((state) => {
								return { ...state, values: { ...state.values, [key]: value } };
							});
						}}
						section={section}
						sectionIndex={sectionIndex}
						title={sectionTitles[sectionIndex] ?? ""}
						values={values}
					/>
				))}

				<div
					ref={(node) => {
						stepRefs.current.set(lastIndex, node);
					}}
					aria-label={t("summary")}
					className="focus:outline-none"
					hidden={currentIndex !== lastIndex}
					role="group"
					tabIndex={-1}
				>
					<Summary emptyLabel={t("not-answered")} sections={sections} titles={sectionTitles} values={values} />
				</div>
			</form>

			<footer className="flex flex-wrap items-center justify-between gap-3 border-bs border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-6">
				<Button
					aria-disabled={currentIndex === 0 || undefined}
					onPress={() => {
						if (currentIndex === 0) {
							return;
						}

						setIndex(currentIndex - 1);
					}}
				>
					<ChevronLeftIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					<span>{t("previous")}</span>
				</Button>

				{currentIndex === lastIndex ? (
					<div className="flex flex-wrap items-center justify-end gap-3">
						{isConfirmingReset ? (
							<Button onPress={reset} variant="danger">
								<RotateCcwIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
								<span>{t("reset-confirm")}</span>
							</Button>
						) : (
							<Button
								onPress={() => {
									setIsConfirmingReset(true);
								}}
							>
								<RotateCcwIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
								<span>{t("reset")}</span>
							</Button>
						)}

						<Button onPress={print}>
							<PrinterIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
							<span>{t("print")}</span>
						</Button>

						<Button onPress={download} variant="primary">
							<DownloadIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
							<span>{t("download")}</span>
						</Button>
					</div>
				) : (
					<Button
						onPress={() => {
							setIndex(currentIndex + 1);
						}}
						variant="primary"
					>
						<span>{currentIndex === lastIndex - 1 ? t("review") : t("next")}</span>
						<ChevronRightIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					</Button>
				)}
			</footer>
		</section>
	);
}

interface StepProps {
	descriptionRef: (node: HTMLDivElement | null) => void;
	id: string;
	isCurrent: boolean;
	ref: (node: HTMLDivElement | null) => void;
	onChange: (key: string, value: string) => void;
	section: WorksheetSectionData;
	sectionIndex: number;
	title: string;
	values: Values;
}

const inputStyles =
	"resize-y rounded-md border border-neutral-300 bg-white px-3 py-2 inline-full focus:border-brand-700 focus:outline-none focus-visible:border-brand-700 focus-visible:ring focus-visible:ring-brand-700";

function Step(props: Readonly<StepProps>): ReactNode {
	const { descriptionRef, id, isCurrent, onChange, ref, section, sectionIndex, title, values } = props;

	const { description, questions } = section;

	return (
		<div
			ref={ref}
			aria-labelledby={id}
			className="grid gap-y-5 focus:outline-none"
			hidden={!isCurrent}
			role="group"
			tabIndex={-1}
		>
			<div className="grid gap-y-1">
				<strong className="text-base/tight font-bold" id={id}>
					{title}
				</strong>

				<div
					ref={descriptionRef}
					className="text-sm/relaxed text-neutral-600 **:first:mbs-0 **:last:mbe-0 [&_a]:underline"
				>
					{description}
				</div>
			</div>

			{questions.map((question, questionIndex) => {
				const { description, label, placeholder, variant } = question;

				const key = createAnswerKey(sectionIndex, questionIndex);
				const value = values[key] ?? "";

				return (
					<TextField
						key={key}
						className="grid gap-y-1.5 text-sm"
						onChange={(value) => {
							onChange(key, value);
						}}
						value={value}
					>
						<Label className="font-medium">{label}</Label>

						{isNonEmptyString(description) ? (
							<Text className="text-neutral-600" slot="description">
								{description}
							</Text>
						) : null}

						{variant === "short" ? (
							<Input className={inputStyles} placeholder={placeholder} />
						) : (
							<TextArea className={inputStyles} placeholder={placeholder} rows={5} />
						)}
					</TextField>
				);
			})}
		</div>
	);
}

interface SummaryProps {
	emptyLabel: string;
	sections: Array<WorksheetSectionData>;
	titles: Array<string>;
	values: Values;
}

function Summary(props: Readonly<SummaryProps>): ReactNode {
	const { emptyLabel, sections, titles, values } = props;

	return (
		<div className="grid gap-y-6">
			{sections.map((section, sectionIndex) => {
				const { questions } = section;

				return (
					<div key={String(sectionIndex)} className="grid gap-y-3">
						<strong className="text-base/tight font-bold text-brand-700">{titles[sectionIndex]}</strong>

						{questions.map((question, questionIndex) => {
							const key = createAnswerKey(sectionIndex, questionIndex);
							const value = values[key]?.trim() ?? "";

							return (
								<div key={key} className="grid gap-y-1 border-s-2 border-neutral-200 ps-3 text-sm/relaxed">
									<dfn className="font-medium not-italic">{question.label}</dfn>

									{isNonEmptyString(value) ? (
										<p className="whitespace-pre-line text-neutral-700">{value}</p>
									) : (
										<p className="text-neutral-500 italic">{emptyLabel}</p>
									)}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}

interface ButtonProps extends AriaButtonProps {
	children: ReactNode;
	variant?: "danger" | "primary" | "secondary";
}

function Button(props: Readonly<ButtonProps>): ReactNode {
	const { children, variant = "secondary" } = props;

	return (
		<AriaButton
			{...props}
			className={cn(
				"inline-flex cursor-default items-center justify-center gap-x-2 rounded-md border px-3 py-1.5 text-sm/normal font-medium whitespace-nowrap transition aria-disabled:opacity-50",
				variant === "primary"
					? "border-brand-700 bg-brand-700 text-white not-aria-disabled:hover:bg-brand-800 pressed:bg-brand-800"
					: variant === "danger"
						? "border-error-600 bg-error-600 text-white not-aria-disabled:hover:bg-error-700 pressed:bg-error-700"
						: "border-neutral-300 bg-white not-aria-disabled:hover:bg-neutral-100 pressed:bg-neutral-200",
			)}
		>
			{children}
		</AriaButton>
	);
}
