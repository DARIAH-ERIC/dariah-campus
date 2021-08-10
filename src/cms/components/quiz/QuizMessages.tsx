import type { ReactElement } from 'react'
import { Fragment } from 'react'

import type { QuizCardStatus } from '@/cms/components/quiz/Quiz'
import { useQuiz } from '@/cms/components/quiz/Quiz'
import type { QuizMessageProps } from '@/cms/components/quiz/QuizMessage'
import { QuizMessage } from '@/cms/components/quiz/QuizMessage'
import { useI18n } from '@/i18n/useI18n'

export interface QuizMessagesProps {
  messages: Array<ReactElement<QuizMessageProps>>
}

/**
 * Container for feedback according to quiz card status.
 */
export function QuizMessages(props: QuizMessagesProps): JSX.Element | null {
  const { messages } = props

  const { t } = useI18n()
  const quiz = useQuiz()

  const statusMessages = messages.filter(
    (message) => message.props.type === quiz.status,
  )

  if (statusMessages.length > 0) {
    return <Fragment>{statusMessages}</Fragment>
  }

  const defaultStatusMessages: Record<QuizCardStatus, string | null> = {
    incorrect: t('common.quiz.incorrect'),
    correct: t('common.quiz.correct'),
    unanswered: null,
  }

  const defaultStatusMessage = defaultStatusMessages[quiz.status]

  if (defaultStatusMessage == null) return null

  return <QuizMessage type={quiz.status}>{defaultStatusMessage}</QuizMessage>
}
