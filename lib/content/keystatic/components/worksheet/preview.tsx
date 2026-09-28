import { isNonEmptyString } from "@acdh-oeaw/lib";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import type { ReactNode } from "react";

/**
 * Keystatic's own theme tokens, so previews follow the light and dark themes of the cms instead of the palette of the
 * website.
 */
const styles = {
	border: "border-(--kui-color-border-muted)",
	borderDashed: "border-dashed border-(--kui-color-border-neutral)",
	surface: "bg-(--kui-color-background-surface)",
	surfaceSecondary: "bg-(--kui-color-background-surface-secondary)",
	textSecondary: "text-(--kui-color-foreground-neutral-secondary)",
	textTertiary: "text-(--kui-color-foreground-neutral-tertiary)",
};

interface WorksheetPreviewProps {
	children: ReactNode;
	title: string;
}

export function WorksheetPreview(props: Readonly<WorksheetPreviewProps>): ReactNode {
	const { children, title } = props;

	return (
		<div className={cn("grid gap-y-3 rounded-sm border p-3 [counter-reset:worksheet-section]", styles.border)}>
			<NotEditable>
				<strong className="text-sm">{title}</strong>
			</NotEditable>

			{children}
		</div>
	);
}

interface WorksheetDescriptionPreviewProps {
	children: ReactNode;
}

export function WorksheetDescriptionPreview(props: Readonly<WorksheetDescriptionPreviewProps>): ReactNode {
	const { children } = props;

	return <div className={cn("text-sm", styles.textSecondary)}>{children}</div>;
}

interface WorksheetSectionPreviewProps {
	children: ReactNode;
	title: string;
}

export function WorksheetSectionPreview(props: Readonly<WorksheetSectionPreviewProps>): ReactNode {
	const { children, title } = props;

	return (
		<div
			className={cn(
				"grid gap-y-2 rounded-sm border px-3 py-2 [counter-increment:worksheet-section]",
				styles.border,
				styles.surfaceSecondary,
			)}
		>
			<NotEditable>
				<span
					className={cn(
						"text-xs uppercase before:[content:'Step_'counter(worksheet-section)'_·_']",
						styles.textTertiary,
					)}
				>
					{title}
				</span>
			</NotEditable>

			{children}
		</div>
	);
}

interface WorksheetSectionDescriptionPreviewProps {
	children: ReactNode;
}

export function WorksheetSectionDescriptionPreview(
	props: Readonly<WorksheetSectionDescriptionPreviewProps>,
): ReactNode {
	const { children } = props;

	return <div className={cn("text-sm", styles.textSecondary)}>{children}</div>;
}

interface WorksheetQuestionPreviewProps {
	description?: string;
	label: string;
	placeholder?: string;
	variant: "long" | "short";
}

export function WorksheetQuestionPreview(props: Readonly<WorksheetQuestionPreviewProps>): ReactNode {
	const { description, label, placeholder, variant } = props;

	return (
		<NotEditable>
			<div className={cn("grid gap-y-1 rounded-sm border px-3 py-2 text-sm", styles.border, styles.surface)}>
				<strong>{label}</strong>

				{isNonEmptyString(description) ? <span className={styles.textSecondary}>{description}</span> : null}

				<div
					className={cn(
						"rounded-sm border px-2 py-1",
						styles.borderDashed,
						styles.textTertiary,
						variant === "long" && "block-16",
					)}
				>
					{isNonEmptyString(placeholder) ? placeholder : "…"}
				</div>
			</div>
		</NotEditable>
	);
}
