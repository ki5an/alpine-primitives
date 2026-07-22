import {
  setAttribute,
  createPresence,
  portalToBody,
  createFocusTrap,
  createDismissableLayer,
  lockBodyScroll,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDrawerContext, requireContext } from '../context'

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-content')) return

    ctx.contentEl = el
    el.id = ctx.ids.content
    setAttribute(el, 'role', 'dialog')
    setAttribute(el, 'tabindex', '-1')
    setAttribute(el, 'aria-labelledby', ctx.ids.title)
    setAttribute(el, 'aria-describedby', ctx.ids.description)
    setAttribute(el, 'data-side', ctx.side)
    if (ctx.modal) setAttribute(el, 'aria-modal', 'true')
    const presence = createPresence(el, { initial: ctx.open })

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    const trap = createFocusTrap(el)
    const layer = createDismissableLayer(el, {
      onDismiss: () => ctx.setOpen(false),
    })

    let unlockScroll = noop
    let wasOpen = ctx.open

    effect(() => {
      const open = ctx.open
      if (open) presence.show()
      else presence.hide()

      if (open && !wasOpen) {
        layer.activate()
        if (ctx.modal) {
          unlockScroll = lockBodyScroll()
          requestAnimationFrame(() => trap.activate())
        }
      } else if (!open && wasOpen) {
        layer.deactivate()
        unlockScroll()
        unlockScroll = noop
        if (ctx.modal) trap.deactivate()
      }

      wasOpen = open
    })

    cleanup(() => {
      layer.deactivate()
      unlockScroll()
      trap.deactivate()
      undoPortal()
    })
  }
}
