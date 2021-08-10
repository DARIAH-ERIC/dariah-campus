import { useAccordion, useAccordionItem } from '@react-aria/accordion'
import { Item } from '@react-stately/collections'
import { useTreeState } from '@react-stately/tree'
import type { TreeState } from '@react-stately/tree'
import type { AriaAccordionProps } from '@react-types/accordion'
import type { Node } from '@react-types/shared'
import cx from 'clsx'
import type { CSSProperties } from 'react'
import { useRef } from 'react'

import { Svg as ChevronIcon } from '@/assets/icons/chevron-down.svg'
import { Icon } from '@/common/Icon'

export interface AccordionProps<T> extends AriaAccordionProps<T> {
  style?: CSSProperties
}

/**
 * Accordion.
 */
export function Accordion<T extends Record<string, unknown>>(
  props: AccordionProps<T>,
): JSX.Element {
  const state = useTreeState<T>(props)
  const ref = useRef<HTMLDivElement>(null)
  const { accordionProps } = useAccordion(props, state, ref)

  return (
    <div
      {...accordionProps}
      ref={ref}
      className="flex flex-col w-full max-w-screen-md py-6 mx-auto space-y-6 text-lg"
      style={props.style}
    >
      {[...state.collection].map((item) => (
        <AccordionItem<T> key={item.key} item={item} state={state} />
      ))}
    </div>
  )
}

interface AccordionItemProps<T> {
  item: Node<T>
  state: TreeState<T>
}

function AccordionItem<T>(props: AccordionItemProps<T>): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null)
  const { state, item } = props
  const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref)
  const isOpen = state.expandedKeys.has(item.key)
  const isDisabled = state.disabledKeys.has(item.key)

  return (
    <div className="flex flex-col">
      <h3 className="flex flex-1">
        <button
          ref={ref}
          {...buttonProps}
          className={cx(
            'flex items-center justify-between flex-1 p-6 transition border border-neutral-100 rounded-xl shadow-md hover:shadow-lg text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600',
            isDisabled && 'pointer-events-none text-neutral-500',
          )}
        >
          <span className="text-left">{item.props.title}</span>
          <Icon
            icon={ChevronIcon}
            className={cx(
              'flex-shrink-0 w-5 h-5 transition transform',
              isOpen && 'rotate-180',
            )}
          />
        </button>
      </h3>
      <div
        {...regionProps}
        hidden={!isOpen}
        className="space-y-1.5 text-left p-6"
      >
        {item.props.children}
      </div>
    </div>
  )
}

Accordion.Item = Item
