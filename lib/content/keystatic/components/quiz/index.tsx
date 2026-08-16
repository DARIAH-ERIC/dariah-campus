/* eslint-disable @eslint-react/prefer-read-only-props */

import { createAssetOptions, createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { MessageCircleQuestionIcon } from "lucide-react";

import { createQuizDragTheWords } from "@/lib/content/keystatic/components/drag-the-words";
import { createQuizFillInTheBlank } from "@/lib/content/keystatic/components/fill-in-the-blank";
import {
	QuizChoiceAnswerErrorMessagePreview,
	QuizChoiceAnswerLabelPreview,
	QuizChoiceAnswerPreview,
	QuizChoicePreview,
	QuizChoiceQuestionPreview,
	QuizErrorMessagePreview,
	QuizImageHotspotEditor,
	QuizImageHotspotsPreview,
	QuizPreview,
	QuizSuccessMessagePreview,
} from "@/lib/content/keystatic/components/quiz/preview";

export const createQuiz = createComponent((paths, locale) => {
	return {
		...createQuizDragTheWords(paths, locale),
		...createQuizFillInTheBlank(paths, locale),
		Quiz: repeating({
			label: "Quiz",
			description: "An interactive quiz.",
			icon: <MessageCircleQuestionIcon />,
			children: ["QuizChoice", "QuizImageHotspots", "QuizFillInTheBlank", "QuizDragTheWords"],
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizPreview>{children}</QuizPreview>;
			},
		}),
		QuizChoice: repeating({
			label: "Quiz - Multiple choice",
			description: "A quiz with one or more correct answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			children: [
				"QuizChoiceQuestion",
				"QuizChoiceAnswer",
				"QuizSuccessMessage",
				"QuizErrorMessage",
			],
			validation: { children: { min: 1 } },
			schema: {
				variant: fields.select({
					label: "Variant",
					options: [
						{ label: "Single correct answer", value: "single" },
						{ label: "Multiple correct answers", value: "multiple" },
					],
					defaultValue: "multiple",
				}),
				buttonLabel: fields.text({
					label: "Button label",
					description: "Custom label for 'Check answer' button.",
					validation: { isRequired: false },
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<QuizChoicePreview buttonLabel={value.buttonLabel} variant={value.variant}>
						{children}
					</QuizChoicePreview>
				);
			},
		}),
		QuizImageHotspots: repeating({
			label: "Quiz - Image hotspots",
			description: "An image with points that reveal explanatory content.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			children: ["QuizImageHotspot"],
			validation: { children: { min: 1 } },
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...createAssetOptions(paths.assetPath),
				}),
				alt: fields.text({
					label: "Image description for assistive technology",
					description:
						"Describe the image and the relevant spatial information; leave empty only if the image is decorative.",
					validation: { isRequired: false },
				}),
				presentation: fields.select({
					label: "Hotspot content presentation",
					description:
						"Inline panels sit beside or below the image. Modal side panels provide more room for longer content. Anchored popovers work best for short explanations.",
					options: [
						{ label: "Inline panel", value: "inline" },
						{ label: "Modal side panel", value: "sidepanel" },
						{ label: "Anchored popover", value: "popover" },
					],
					defaultValue: "inline",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return (
					<QuizImageHotspotsPreview alt={value.alt} src={value.src}>
						{children}
					</QuizImageHotspotsPreview>
				);
			},
		}),
		QuizImageHotspot: wrapper({
			label: "Image hotspot",
			description: "A point on the image that opens explanatory content.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			editChildrenIn: "modal",
			schema: {
				label: fields.text({
					label: "Hotspot label",
					description: "Identifies the hotspot to screen-reader users and titles its popover.",
					validation: { isRequired: true },
				}),
				x: fields.number({
					label: "Horizontal position (%)",
					defaultValue: 50,
					step: 0.1,
					validation: { isRequired: true, min: 0, max: 100 },
				}),
				y: fields.number({
					label: "Vertical position (%)",
					defaultValue: 50,
					step: 0.1,
					validation: { isRequired: true, min: 0, max: 100 },
				}),
			},
			NodeView(props) {
				return <QuizImageHotspotEditor {...props} />;
			},
		}),
		QuizChoiceAnswer: repeating({
			label: "Answer",
			description: "An answer in a multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			children: ["QuizChoiceAnswerLabel", "QuizChoiceAnswerErrorMessage"],
			validation: { children: { min: 1, max: 2 } },
			schema: {
				kind: fields.select({
					label: "Kind",
					options: [
						{ label: "Correct", value: "correct" },
						{ label: "Incorrect", value: "incorrect" },
					],
					defaultValue: "incorrect",
				}),
			},
			ContentView(props) {
				const { children, value } = props;

				return <QuizChoiceAnswerPreview kind={value.kind}>{children}</QuizChoiceAnswerPreview>;
			},
		}),
		QuizChoiceAnswerLabel: wrapper({
			label: "Answer text",
			description: "The text displayed next to the answer control.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizChoiceAnswerLabelPreview>{children}</QuizChoiceAnswerLabelPreview>;
			},
		}),
		QuizChoiceAnswerErrorMessage: wrapper({
			label: "Answer error message",
			description: "Rich-text feedback shown when this answer's selected state is incorrect.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return (
					<QuizChoiceAnswerErrorMessagePreview>{children}</QuizChoiceAnswerErrorMessagePreview>
				);
			},
		}),
		QuizChoiceQuestion: wrapper({
			label: "Question",
			description: "A question in a multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizChoiceQuestionPreview>{children}</QuizChoiceQuestionPreview>;
			},
		}),
		QuizErrorMessage: wrapper({
			label: "Quiz error message",
			description: "Help text for incorrect answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizErrorMessagePreview>{children}</QuizErrorMessagePreview>;
			},
		}),
		QuizSuccessMessage: wrapper({
			label: "Quiz success message",
			description: "Help text for correct answers.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizSuccessMessagePreview>{children}</QuizSuccessMessagePreview>;
			},
		}),
	};
});
