import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";

import { getChildrenByType } from "#/components/content/get-children-by-type.ts";
import { WorksheetForm, type WorksheetSectionData } from "#/components/content/worksheet-form.tsx";

interface WorksheetProps {
	children: ReactNode;
	title?: string;
}

/**
 * Note that this must stay a server component: it identifies its children by comparing `child.type`, which only works
 * while the mdx components and the imports here resolve to the same objects. In a client component the children arrive
 * as separate lazy references, and nothing matches.
 */
export function Worksheet(props: Readonly<WorksheetProps>): ReactNode {
	const { children, title } = props;

	const get = getChildrenByType(children);

	const description = get(WorksheetDescription);

	/**
	 * The cms saves entries even when a required field was left empty, so questions without a prompt, and sections
	 * without any question, are dropped instead of rendering a step nobody can fill in.
	 */
	const sections: Array<WorksheetSectionData> = get(WorksheetSection)
		.map((section) => {
			const getSectionChild = getChildrenByType(section.props.children);
			const description = getSectionChild(WorksheetSectionDescription);

			return {
				description,
				/** Whether `description` has content, which cannot be determined from a `ReactNode`. */
				hasDescription: description.length > 0,
				questions: getSectionChild(WorksheetQuestion)
					.filter((question) => isNonEmptyString(question.props.label))
					.map((question) => {
						return {
							description: question.props.description,
							label: question.props.label,
							placeholder: question.props.placeholder,
							variant: question.props.variant ?? ("long" as const),
						};
					}),
				title: section.props.title,
			};
		})
		.filter((section) => section.questions.length > 0);

	if (sections.length === 0) {
		return null;
	}

	return (
		<WorksheetForm
			description={description}
			hasDescription={description.length > 0}
			sections={sections}
			title={title}
		/>
	);
}

interface WorksheetDescriptionProps {
	children: ReactNode;
}

export function WorksheetDescription(props: Readonly<WorksheetDescriptionProps>): ReactNode {
	const { children } = props;

	return children;
}

interface WorksheetSectionProps {
	children: ReactNode;
	title?: string;
}

export function WorksheetSection(_props: Readonly<WorksheetSectionProps>): ReactNode {
	return null;
}

interface WorksheetSectionDescriptionProps {
	children: ReactNode;
}

export function WorksheetSectionDescription(props: Readonly<WorksheetSectionDescriptionProps>): ReactNode {
	const { children } = props;

	return children;
}

interface WorksheetQuestionProps {
	description?: string;
	label: string;
	placeholder?: string;
	variant?: "long" | "short";
}

export function WorksheetQuestion(_props: Readonly<WorksheetQuestionProps>): ReactNode {
	return null;
}
