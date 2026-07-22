import {
  setAttribute,
  applyPresence,
  portalToBody,
  createFocusTrap,
  createDismissableLayer,
  lockBodyScroll,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useAlertDialogContext, requireContext } from '../context'

/**
 * `x-alert-dialog-content` — the `role="alertdialog"` panel. Portalled, focus
 * trapped, scroll locked. Escape closes; outside press is ignored. Initial
 * focus goes to the cancel action when present.
 */
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
    applyPresence(el, ctx.open)

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    const trap = createFocusTrap(el)
    const layer = createDismissableLayer(el, {
      onDismiss: () => ctx.setOpen(false),
      // An alert dialog is not dismissed by clicking outside it.
      onPointerDownOutside: (event) => event.preventDefault(),
    })

    let unlockScroll = noop
    let wasOpen = ctx.open

    effect(() => {
      const open = ctx.open
      applyPresence(el, open)

      if (open && !wasOpen) {
        unlockScroll = lockBodyScroll()
        layer.activate()
        requestAnimationFrame(() => {
          trap.activate()
          // Prefer the cancel action for initial focus (least destructive).
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
