/* eslint-disable @eslint-react/prefer-read-only-props */

import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { repeating, wrapper } from "@keystatic/core/content-components";
import { MessageCircleQuestionIcon } from "lucide-react";

import {
	QuizChoiceAnswerPreview,
	QuizChoicePreview,
	QuizChoiceQuestionPreview,
	QuizErrorMessagePreview,
	QuizPreview,
	QuizSuccessMessagePreview,
	QuizTextInputPreview,
} from "@/lib/content/keystatic/components/quiz/preview";

export const createQuiz = createComponent((_paths, _locale) => {
	return {
		Quiz: repeating({
			label: "Quiz",
			description: "An interactive quiz.",
			icon: <MessageCircleQuestionIcon />,
			children: ["QuizChoice", "QuizTextInput"],
			validation: { children: { min: 1 } },
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizPreview>{children}</QuizPreview>;
			},
		}),
		QuizChoice: repeating({
			label: "Choice quiz",
			description: "A single or multiple choice quiz.",
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
						{ label: "Single choice", value: "single" },
						{ label: "Multiple choice", value: "multiple" },
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
		QuizChoiceAnswer: wrapper({
			label: "Answer",
			description: "An answer in a single/multiple choice quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
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
		QuizChoiceQuestion: wrapper({
			label: "Question",
			description: "A question in a single/multiple choice quiz.",
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
		QuizTextInput: wrapper({
			label: "Text input quiz.",
			description: "A text input quiz.",
			icon: <MessageCircleQuestionIcon />,
			forSpecificLocations: true,
			schema: {},
			ContentView(props) {
				const { children } = props;

				return <QuizTextInputPreview>{children}</QuizTextInputPreview>;
			},
		}),
	};
});
