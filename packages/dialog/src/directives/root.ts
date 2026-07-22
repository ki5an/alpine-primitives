import {
  provideContext,
  generateId,
  dispatchEvent,
  acquireZIndex,
  type ZIndexTier,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { DIALOG_CONTEXT } from '../context'
import { DialogEvents } from '../events'
import type { DialogContext } from '../types'

export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression, modifiers }, { effect, evaluate, cleanup }) => {
    const ids = {
      trigger: generateId('dialog-trigger'),
      content: generateId('dialog-content'),
      title: generateId('dialog-title'),
      description: generateId('dialog-description'),
    }

    let initialOpen = false
    let modal = !modifiers.includes('non-modal')

    if (expression && expression.trim()) {
      const value = evaluate(expression)
      if (typeof value === 'boolean') {
        initialOpen = value
      } else if (value && typeof value === 'object') {
        const obj = value as { open?: unknown; modal?: unknown }
        initialOpen = Boolean(obj.open)
        if ('modal' in obj) modal = Boolean(obj.modal)
      }
    }

    const context = Alpine.reactive<DialogContext>({
      open: initialOpen,
      modal,
      ids,
      triggerEl: null,
      zIndex: null,
      setOpen(value: boolean) {
        context.open = value
      },
      toggle() {
        context.open = !context.open
      },
    })

    provideContext(el, DIALOG_CONTEXT, context)
    el.setAttribute('data-dialog-root', '')

    let tier: ZIndexTier | null = null
    effect(() => {
      if (context.open && !tier) {
        tier = acquireZIndex()
        context.zIndex = { overlay: tier.overlay, content: tier.content }
      } else if (!context.open && tier) {
        tier.release()
        tier = null
        context.zIndex = null
      }
    })
    cleanup(() => {
      tier?.release()
      tier = null
    })

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? DialogEvents.open : DialogEvents.close, { open })
    })
  }
}
