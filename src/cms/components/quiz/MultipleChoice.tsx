import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

import { getChildElements } from '@/cms/components/quiz/getChildElements'
import { QuizCardStatus, useQuiz } from '@/cms/components/quiz/Quiz'
import { QuizCardLayout } from '@/cms/components/quiz/QuizCardLayout'

export interface MultipleChoiceProps {
  children?: ReactNode
  variant?: 'multiple' | 'single'
}

/**
 * Multiple choice quiz.
 */
export function MultipleChoice(props: MultipleChoiceProps): JSX.Element {
  const quiz = useQuiz()

  const childElements = getChildElements(props.children)
  const options = childElements.filter(isMultipleChoiceOption)

  const correctAnswers = options
    .filter((option) => option.props.isCorrect === true)
    .map((option) => options.indexOf(option))
  const isSingleChoice = props.variant === 'single'
  /**
   * Put `Set` in a 1-tuple, so we don't need to recreate the `Set` on every change.
   */
  const [[checked], setChecked] = useState<[Set<number>]>([new Set()])

  function toggle(index: number) {
    if (isSingleChoice) {
      setChecked([new Set([index])])
    } else {
      setChecked(([checked]) => {
        if (checked.has(index)) {
          checked.delete(index)
        } else {
          checked.add(index)
        }
        return [checked]
      })
    }

    quiz.setStatus(QuizCardStatus.UNANSWERED)
  }

  function onValidate() {
    const isCorrect =
      correctAnswers.length === checked.size &&
      correctAnswers.every((index) => checked.has(index))

    quiz.setStatus(
      isCorrect === true ? QuizCardStatus.CORRECT : QuizCardStatus.INCORRECT,
    )
  }

  const name = /** TODO: unique name */ 'quiz'
  const type = isSingleChoice ? 'radio' : 'checkbox'

  const component = (
    <ul className="flex flex-col space-y-4">
      {options.map((option, index) => {
        return (
          <li key={index} className="!p-0 !m-0 before:!hidden">
            <label className="flex items-center space-x-4">
              <input
                type={type}
                name={name}
                onChange={() => toggle(index)}
                checked={checked.has(index)}
              />
              {option}
            </label>
          </li>
        )
      })}
    </ul>
  )

  return (
    <QuizCardLayout component={component} onValidate={onValidate}>
      {props.children}
    </QuizCardLayout>
  )
}

MultipleChoice.isQuizCard = true

export interface MultipleChoiceOptionProps {
  children?: ReactNode
  isCorrect?: boolean
}

/**
 * Multiple choice option.
 */
export function MultipleChoiceOption(
  props: MultipleChoiceOptionProps,
): JSX.Element {
  return <span>{props.children}</span>
}

/**
 * Type guard for MultipleChoiceOption component.
 */
export function isMultipleChoiceOption(
  component: JSX.Element,
): component is ReactElement<MultipleChoiceOptionProps> {
  return component.type === MultipleChoiceOption
}

MultipleChoice.Option = MultipleChoiceOption
