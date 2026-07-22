import {
  provideContext,
  generateId,
  dispatchEvent,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { ALERT_DIALOG_CONTEXT, type AlertDialogContext } from '../context'

/**
 * `x-alert-dialog` — root of a modal that interrupts and requires an explicit
 * choice. Always modal; unlike a plain dialog it is not dismissed by clicking
 * the backdrop. Optional expression sets initial open state.
 */
export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression }, { effect, evaluate }) => {
    let initialOpen = false
    if (expression && expression.trim()) {
      initialOpen = Boolean(evaluate(expression))
    }

    const context = Alpine.reactive<AlertDialogContext>({
      open: initialOpen,
      ids: {
        trigger: generateId('alert-dialog-trigger'),
        content: generateId('alert-dialog-content'),
        title: generateId('alert-dialog-title'),
        description: generateId('alert-dialog-description'),
      },
      triggerEl: null,
      cancelEl: null,
      setOpen(value: boolean) {
        context.open = value
      },
      toggle() {
        context.open = !context.open
      },
    })

    provideContext(el, ALERT_DIALOG_CONTEXT, context)
    el.setAttribute('data-alert-dialog-root', '')

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? 'alert-dialog:open' : 'alert-dialog:close', { open })
    })
  }
}
