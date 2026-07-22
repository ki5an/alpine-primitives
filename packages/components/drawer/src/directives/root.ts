import {
  provideContext,
  generateId,
  dispatchEvent,
  type AlpineGlobal,
  type DirectiveCallback,
  type Side,
} from '@alpine-primitives/core'
import { DRAWER_CONTEXT, sideFromModifiers, type DrawerContext } from '../context'

/**
 * `x-drawer` — an edge panel (default bottom) that can be dragged to dismiss.
 *
 *   x-drawer.bottom
 *   x-drawer="{ side: 'left', dismissThreshold: 120 }"
 */
export function root(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, { expression, modifiers }, { effect, evaluate }) => {
    let side: Side = sideFromModifiers(modifiers, 'bottom')
    let modal = !modifiers.includes('non-modal')
    let dismissThreshold = 100
    let initialOpen = false

    if (expression && expression.trim()) {
      const value = evaluate(expression) as
        | { side?: Side; modal?: boolean; dismissThreshold?: number; open?: boolean }
        | boolean
        | undefined
      if (typeof value === 'boolean') {
        initialOpen = value
      } else if (value && typeof value === 'object') {
        if (value.side) side = value.side
        if (typeof value.modal === 'boolean') modal = value.modal
        if (typeof value.dismissThreshold === 'number') dismissThreshold = value.dismissThreshold
        if (typeof value.open === 'boolean') initialOpen = value.open
      }
    }

    const context = Alpine.reactive<DrawerContext>({
      open: initialOpen,
      side,
      modal,
      dismissThreshold,
      ids: {
        trigger: generateId('drawer-trigger'),
        content: generateId('drawer-content'),
        title: generateId('drawer-title'),
        description: generateId('drawer-description'),
      },
      triggerEl: null,
      contentEl: null,
      setOpen(value: boolean) {
        context.open = value
      },
      toggle() {
        context.open = !context.open
      },
    })

    provideContext(el, DRAWER_CONTEXT, context)
    el.setAttribute('data-drawer-root', '')
    el.setAttribute('data-side', side)

    let first = true
    effect(() => {
      const open = context.open
      el.setAttribute('data-state', open ? 'open' : 'closed')
      if (first) {
        first = false
        return
      }
      dispatchEvent(el, open ? 'drawer:open' : 'drawer:close', { open })
    })
  }
}
