import { type ReactNode, useState } from "react";

import { QuizCardStatus, useQuiz } from "@/cms/components/quiz/Quiz";
import { QuizCardLayout } from "@/cms/components/quiz/QuizCardLayout";

export interface TextInputProps {
	children?: ReactNode;
}

/**
 * Text input quiz.
 */
export function TextInput(props: TextInputProps): JSX.Element {
	const quiz = useQuiz();

	const [input, setInput] = useState("");

	function onValidate() {
		// FIXME: do we really not want to validate?
		const isCorrect = input.length > 0;
		quiz.setStatus(isCorrect === true ? QuizCardStatus.CORRECT : QuizCardStatus.INCORRECT);
	}

	const name = /** TODO: unique name */ "quiz";
	const label = /** TODO: accept label via props */ "Answer";

	const component = (
		<label>
			<div className="sr-only">{label}</div>
			<input
				className="border-2 mt-4 mb-6"
				name={name}
				onChange={(event) => {
					setInput(event.currentTarget.value as string);
				}}
				value={input}
			/>
		</label>
	);

	return (
		<QuizCardLayout component={component} onValidate={onValidate}>
			{props.children}
		</QuizCardLayout>
	);
}

TextInput.isQuizCard = true;
