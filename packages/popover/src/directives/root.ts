import {
  provideContext,
  generateId,
  dispatchEvent,
  type AlpineGlobal,
  type DirectiveCallback,
  type Placement,
} from '@alpine-primitives/core'
import { POPOVER_CONTEXT, type PopoverContext } from '../context'

/**
 * `x-popover` — root of a non-modal floating panel anchored to its trigger.
 *
 *   x-popover="{ placement: 'bottom-start', offset: 8, modal: false }"
 */
export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression, modifiers }, { effect, evaluate }) => {
    let placement: Placement = 'bottom'
    let offset = 8
    let modal = modifiers.includes('modal')

    if (expression && expression.trim()) {
      const value = evaluate(expression) as
        | { placement?: Placement; offset?: number; modal?: boolean }
        | undefined
      if (value && typeof value === 'object') {
        if (value.placement) placement = value.placement
        if (typeof value.offset === 'number') offset = value.offset
        if (typeof value.modal === 'boolean') modal = value.modal
      }
    }

    const context = Alpine.reactive<PopoverContext>({
      open: false,
      modal,
      placement,
      offset,
      ids: {
        trigger: generateId('popover-trigger'),
        content: generateId('popover-content'),
      },
      triggerEl: null,
      anchorEl: null,
      arrowEl: null,
      setOpen(value: boolean) {
        context.open = value
      },
      toggle() {
        context.open = !context.open
      },
    })

    provideContext(el, POPOVER_CONTEXT, context)
    el.setAttribute('data-popover-root', '')

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? 'popover:open' : 'popover:close', { open })
    })
  }
}
