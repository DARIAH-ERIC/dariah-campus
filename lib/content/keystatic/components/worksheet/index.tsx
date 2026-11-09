import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { block, repeating, wrapper } from "@keystatic/core/content-components";
import { FileTextIcon, ListIcon, PencilLineIcon, TextIcon } from "lucide-react";

import {
	WorksheetDescriptionPreview,
	WorksheetPreview,
	WorksheetQuestionPreview,
	WorksheetSectionDescriptionPreview,
	WorksheetSectionPreview,
} from "#/lib/content/keystatic/components/worksheet/preview.tsx";

export const createWorksheet = createComponent((_paths, _locale) => {
	return {
		Worksheet: repeating({
			label: "Worksheet",
			description: "Insert a form learners fill in and download.",
			icon: <FileTextIcon />,
			schema: {
				title: fields.text({
					label: "Document title",
					description: "Also used as title of the downloaded document.",
					validation: { isRequired: true },
				}),
			},
			children: ["WorksheetDescription", "WorksheetSection"],
			validation: { children: { min: 1 } },
			ContentView(props) {
				const { children, value } = props;

				return <WorksheetPreview title={value.title}>{children}</WorksheetPreview>;
			},
		}),
		WorksheetDescription: wrapper({
			label: "Worksheet - Introduction",
			description: "Insert an introduction for the worksheet.",
			icon: <TextIcon />,
			schema: {},
			forSpecificLocations: true,
			ContentView(props) {
				const { children } = props;

				return <WorksheetDescriptionPreview>{children}</WorksheetDescriptionPreview>;
			},
		}),
		WorksheetSection: repeating({
			label: "Worksheet - Section",
			description: "Insert a section, shown as one step.",
			icon: <ListIcon />,
			schema: {
				title: fields.text({
					label: "Section title",
					validation: { isRequired: true },
				}),
			},
			children: ["WorksheetSectionDescription", "WorksheetQuestion"],
			validation: { children: { min: 1 } },
			forSpecificLocations: true,
			ContentView(props) {
				const { children, value } = props;

				return <WorksheetSectionPreview title={value.title}>{children}</WorksheetSectionPreview>;
			},
		}),
		WorksheetSectionDescription: wrapper({
			label: "Worksheet - Section introduction",
			description: "Insert an introduction for this section.",
			icon: <TextIcon />,
			schema: {},
			forSpecificLocations: true,
			ContentView(props) {
				const { children } = props;

				return <WorksheetSectionDescriptionPreview>{children}</WorksheetSectionDescriptionPreview>;
			},
		}),
		WorksheetQuestion: block({
			label: "Worksheet - Question",
			description: "Insert a prompt with a text input.",
			icon: <PencilLineIcon />,
			schema: {
				label: fields.text({
					label: "Prompt",
					description: "Also used as heading in the downloaded document.",
					validation: { isRequired: true },
				}),
				description: fields.text({
					label: "Helper text",
					description: "Guidance below the prompt. Not downloaded.",
					multiline: true,
					validation: { isRequired: false },
				}),
				variant: fields.select({
					label: "Input type",
					options: [
						{ label: "Multiple lines", value: "long" },
						{ label: "Single line", value: "short" },
					],
					defaultValue: "long",
				}),
				placeholder: fields.text({
					label: "Placeholder",
					description: "Example answer, shown in the empty input.",
					validation: { isRequired: false },
				}),
			},
			forSpecificLocations: true,
			ContentView(props) {
				const { value } = props;

				return (
					<WorksheetQuestionPreview
						description={value.description}
						label={value.label}
						placeholder={value.placeholder}
						variant={value.variant}
					/>
				);
			},
		}),
	};
});
