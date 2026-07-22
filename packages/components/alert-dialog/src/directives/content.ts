import {
  setAttribute,
  createPresence,
  mountTemplate,
  createFocusTrap,
  createDismissableLayer,
  lockBodyScroll,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { ALERT_DIALOG_CONTEXT, useAlertDialogContext, requireContext } from '../context'

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-content')) return

    const mounted = mountTemplate(Alpine, el, {
      contextKey: ALERT_DIALOG_CONTEXT,
      context: ctx,
    })
    if (!mounted) return
    const { root, portal } = mounted

    root.id = ctx.ids.content
    setAttribute(root, 'role', 'alertdialog')
    setAttribute(root, 'aria-modal', 'true')
    setAttribute(root, 'tabindex', '-1')
    setAttribute(root, 'aria-labelledby', ctx.ids.title)
    setAttribute(root, 'aria-describedby', ctx.ids.description)
    const presence = createPresence(root, { initial: ctx.open })

    const trap = createFocusTrap(root)
    const layer = createDismissableLayer(root, {
      onDismiss: () => ctx.setOpen(false),
      onPointerDownOutside: (event) => event.preventDefault(),
    })

    let unlockScroll = noop
    let wasOpen = ctx.open

    effect(() => {
      const open = ctx.open
      if (open) portal.mount()
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
      mounted.destroy()
    })
  }
}
