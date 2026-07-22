import {
  provideContext,
  generateId,
  dispatchEvent,
  type AlpineGlobal,
  type DirectiveCallback,
  type Placement,
} from '@alpine-primitives/core'
import { HOVER_CARD_CONTEXT, type HoverCardContext } from '../context'

/**
 * `x-hover-card` — root. Reveals rich, interactive content on hover/focus for
 * sighted pointer users.
 *
 *   x-hover-card="{ placement: 'bottom', openDelay: 700, closeDelay: 300 }"
 */
export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression }, { effect, evaluate }) => {
    let placement: Placement = 'bottom'
    let offset = 8
    let openDelay = 700
    let closeDelay = 300

    if (expression && expression.trim()) {
      const value = evaluate(expression) as
        | { placement?: Placement; offset?: number; openDelay?: number; closeDelay?: number }
        | undefined
      if (value && typeof value === 'object') {
        if (value.placement) placement = value.placement
        if (typeof value.offset === 'number') offset = value.offset
        if (typeof value.openDelay === 'number') openDelay = value.openDelay
        if (typeof value.closeDelay === 'number') closeDelay = value.closeDelay
      }
    }

    let openTimer = 0
    let closeTimer = 0
    const clear = () => {
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    }

    const context = Alpine.reactive<HoverCardContext>({
      open: false,
      placement,
      offset,
      openDelay,
      closeDelay,
      ids: { content: generateId('hover-card-content') },
      triggerEl: null,
      arrowEl: null,
      setOpen(value: boolean) {
        clear()
        context.open = value
      },
      scheduleOpen() {
        clear()
        openTimer = window.setTimeout(() => {
          context.open = true
        }, context.openDelay)
      },
      scheduleClose() {
        clear()
        closeTimer = window.setTimeout(() => {
          context.open = false
        }, context.closeDelay)
      },
      cancelTimers: clear,
    })

    provideContext(el, HOVER_CARD_CONTEXT, context)
    el.setAttribute('data-hover-card-root', '')

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? 'hover-card:open' : 'hover-card:close', { open })
    })
  }
}
