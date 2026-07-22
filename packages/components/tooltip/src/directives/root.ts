import {
  provideContext,
  generateId,
  dispatchEvent,
  type AlpineGlobal,
  type DirectiveCallback,
  type Placement,
} from '@alpine-primitives/core'
import { TOOLTIP_CONTEXT, type TooltipContext } from '../context'

/**
 * `x-tooltip` — root. Shows a `role="tooltip"` label on hover/focus.
 *
 *   x-tooltip="{ placement: 'top', offset: 6, delay: 300, closeDelay: 0 }"
 */
export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression }, { effect, evaluate }) => {
    let placement: Placement = 'top'
    let offset = 6
    let delay = 300
    let closeDelay = 0

    if (expression && expression.trim()) {
      const value = evaluate(expression) as
        | { placement?: Placement; offset?: number; delay?: number; closeDelay?: number }
        | undefined
      if (value && typeof value === 'object') {
        if (value.placement) placement = value.placement
        if (typeof value.offset === 'number') offset = value.offset
        if (typeof value.delay === 'number') delay = value.delay
        if (typeof value.closeDelay === 'number') closeDelay = value.closeDelay
      }
    }

    const context = Alpine.reactive<TooltipContext>({
      open: false,
      placement,
      offset,
      delay,
      closeDelay,
      ids: { content: generateId('tooltip-content') },
      triggerEl: null,
      arrowEl: null,
      setOpen(value: boolean) {
        context.open = value
      },
    })

    provideContext(el, TOOLTIP_CONTEXT, context)
    el.setAttribute('data-tooltip-root', '')

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? 'tooltip:open' : 'tooltip:close', { open })
    })
  }
}
