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
import { useAlertDialogContext, requireContext } from '../context'

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-content')) return

    el.id = ctx.ids.content
    setAttribute(el, 'role', 'alertdialog')
    setAttribute(el, 'aria-modal', 'true')
    setAttribute(el, 'tabindex', '-1')
    setAttribute(el, 'aria-labelledby', ctx.ids.title)
    setAttribute(el, 'aria-describedby', ctx.ids.description)
    const presence = createPresence(el, { initial: ctx.open })

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    const trap = createFocusTrap(el)
    const layer = createDismissableLayer(el, {
      onDismiss: () => ctx.setOpen(false),
      onPointerDownOutside: (event) => event.preventDefault(),
    })

    let unlockScroll = noop
    let wasOpen = ctx.open

    effect(() => {
      const open = ctx.open
      if (open) presence.show()
      else presence.hide()

      if (open && !wasOpen) {
        unlockScroll = lockBodyScroll()
        layer.activate()
        requestAnimationFrame(() => {
          trap.activate()
          if (ctx.cancelEl) ctx.cancelEl.focus()
        })
      } else if (!open && wasOpen) {
        unlockScroll()
        unlockScroll = noop
        layer.deactivate()
        trap.deactivate()
      }

      wasOpen = open
    })

    cleanup(() => {
      unlockScroll()
      layer.deactivate()
      trap.deactivate()
      undoPortal()
    })
  }
}
