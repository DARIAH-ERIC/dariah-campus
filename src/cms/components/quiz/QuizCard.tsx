import type { ReactElement, ReactNode } from 'react'

import { useQuiz } from '@/cms/components/quiz/Quiz'

export interface QuizCardProps {
  children?: ReactNode
  validateButtonLabel?: string
}

/**
 * Quiz card.
 */
export function QuizCard(props: QuizCardProps): JSX.Element {
  const { isHidden } = useQuiz()
  return <div hidden={isHidden}>{props.children}</div>
}

/**
 * Type guard for QuizCard component.
 */
export function isQuizCard(
  component: JSX.Element,
): component is ReactElement<QuizCardProps> {
  return component.type === QuizCard
}
