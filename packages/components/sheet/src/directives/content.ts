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
import { SHEET_CONTEXT, useSheetContext, requireContext } from '../context'

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-content')) return

    const mounted = mountTemplate(Alpine, el, {
      contextKey: SHEET_CONTEXT,
      context: ctx,
    })
    if (!mounted) return
    const { root, portal } = mounted

    root.id = ctx.ids.content
    setAttribute(root, 'role', 'dialog')
    setAttribute(root, 'tabindex', '-1')
    setAttribute(root, 'aria-labelledby', ctx.ids.title)
    setAttribute(root, 'aria-describedby', ctx.ids.description)
    setAttribute(root, 'data-side', ctx.side)
    if (ctx.modal) setAttribute(root, 'aria-modal', 'true')
    const presence = createPresence(root, { initial: ctx.open })

    const trap = createFocusTrap(root)
    const layer = createDismissableLayer(root, {
      onDismiss: () => ctx.setOpen(false),
    })

    let unlockScroll = noop
    let wasOpen = ctx.open

    effect(() => {
      const open = ctx.open
      if (open) portal.mount()
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
      mounted.destroy()
    })
  }
}
