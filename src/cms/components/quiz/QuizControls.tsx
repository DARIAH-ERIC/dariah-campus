import cx from 'clsx'

import { ActionButton } from '@/cms/components/quiz/ActionButton'
import { QuizCardStatus, useQuiz } from '@/cms/components/quiz/Quiz'

export interface QuizControlsProps {
  onValidate: () => void
}

/**
 * Quiz controls.
 */
export function QuizControls(props: QuizControlsProps): JSX.Element {
  const quiz = useQuiz()

  const buttonVariants = {
    [QuizCardStatus.UNANSWERED]: undefined,
    [QuizCardStatus.INCORRECT]: 'error' as const,
    [QuizCardStatus.CORRECT]: 'success' as const,
  }

  function getButtonVariant(status: QuizCardStatus | undefined) {
    if (status === undefined) return undefined
    return buttonVariants[status]
  }

  const isSingleQuestionQuiz = !quiz.hasPrevious && !quiz.hasNext

  return (
    <div
      className={cx(
        'flex items-center space-x-2',
        isSingleQuestionQuiz ? 'justify-center' : 'justify-between',
      )}
    >
      {!isSingleQuestionQuiz ? (
        <ActionButton
          isDisabled={!quiz.hasPrevious}
          onPress={quiz.previous}
          variant={getButtonVariant(quiz.previousStatus)}
        >
          {quiz.labels.previous}
        </ActionButton>
      ) : null}
      <div>
        <ActionButton
          onPress={props.onValidate}
          variant={getButtonVariant(quiz.status)}
        >
          {quiz.labels.validate}
        </ActionButton>
      </div>
      {!isSingleQuestionQuiz ? (
        <ActionButton
          isDisabled={!quiz.hasNext}
          onPress={quiz.next}
          variant={getButtonVariant(quiz.nextStatus)}
        >
          {quiz.labels.next}
        </ActionButton>
      ) : null}
    </div>
  )
}
