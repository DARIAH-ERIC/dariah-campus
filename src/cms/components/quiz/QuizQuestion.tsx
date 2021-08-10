import type { ReactElement, ReactNode } from 'react'

export interface QuizQuestionProps {
  children?: ReactNode
}

/**
 * Quiz question.
 */
export function QuizQuestion(props: QuizQuestionProps): JSX.Element {
  return <div className="flex flex-col space-y-2">{props.children}</div>
}

/**
 * Type guard for QuizQuestion component.
 */
export function isQuizQuestion(
  component: JSX.Element,
): component is ReactElement<QuizQuestionProps> {
  return component.type === QuizQuestion
}
