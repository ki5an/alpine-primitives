import {
  provideContext,
  generateId,
  dispatchEvent,
  type AlpineGlobal,
  type DirectiveCallback,
  type Side,
} from '@alpine-primitives/core'
import { SHEET_CONTEXT, sideFromModifiers, type SheetContext } from '../context'

/**
 * `x-sheet` — a modal panel anchored to a viewport edge.
 *
 *   x-sheet.left                     side via modifier
 *   x-sheet="{ side: 'bottom', modal: true }"
 */
export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression, modifiers }, { effect, evaluate }) => {
    let side: Side = sideFromModifiers(modifiers, 'right')
    let modal = !modifiers.includes('non-modal')
    let initialOpen = false

    if (expression && expression.trim()) {
      const value = evaluate(expression) as
        | { side?: Side; modal?: boolean; open?: boolean }
        | boolean
        | undefined
      if (typeof value === 'boolean') {
        initialOpen = value
      } else if (value && typeof value === 'object') {
        if (value.side) side = value.side
        if (typeof value.modal === 'boolean') modal = value.modal
        if (typeof value.open === 'boolean') initialOpen = value.open
      }
    }

    const context = Alpine.reactive<SheetContext>({
      open: initialOpen,
      side,
      modal,
      ids: {
        trigger: generateId('sheet-trigger'),
        content: generateId('sheet-content'),
        title: generateId('sheet-title'),
        description: generateId('sheet-description'),
      },
      triggerEl: null,
      setOpen(value: boolean) {
        context.open = value
      },
      toggle() {
        context.open = !context.open
      },
    })

    provideContext(el, SHEET_CONTEXT, context)
    el.setAttribute('data-sheet-root', '')
    el.setAttribute('data-side', side)

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? 'sheet:open' : 'sheet:close', { open })
    })
  }
}
