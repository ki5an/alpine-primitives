import {
  setAttribute,
  createPresence,
  mountTemplate,
  createFocusTrap,
  lockBodyScroll,
  onKey,
  Keys,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { DIALOG_CONTEXT, useDialogContext } from '../context'
import { requireContext } from '../utils'

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-content')) return

    const mounted = mountTemplate(Alpine, el, {
      contextKey: DIALOG_CONTEXT,
      context: ctx,
    })
    if (!mounted) return
    const { root, portal } = mounted

    root.id = ctx.ids.content
    setAttribute(root, 'role', 'dialog')
    setAttribute(root, 'tabindex', '-1')
    setAttribute(root, 'aria-labelledby', ctx.ids.title)
    setAttribute(root, 'aria-describedby', ctx.ids.description)

    const presence = createPresence(root, { initial: ctx.open })

    const trap = createFocusTrap(root)
    let unlockScroll = noop
    let removeEscape = noop

    effect(() => {
      setAttribute(root, 'aria-modal', ctx.modal ? 'true' : null)
    })

    effect(() => {
      const z = ctx.zIndex
      if (z) root.style.zIndex = String(z.content)
    })

    let wasOpen = ctx.open
    effect(() => {
      const open = ctx.open
      if (open) portal.mount()
      if (open) presence.show()
      else presence.hide()

      if (open && !wasOpen) {
        if (ctx.modal) unlockScroll = lockBodyScroll()
        removeEscape = onKey(document, Keys.Escape, (event) => {
          event.preventDefault()
          ctx.setOpen(false)
        })
        requestAnimationFrame(() => trap.activate())
      } else if (!open && wasOpen) {
        unlockScroll()
        unlockScroll = noop
        removeEscape()
        removeEscape = noop
        trap.deactivate()
      }

      wasOpen = open
    })

    cleanup(() => {
      unlockScroll()
      removeEscape()
      trap.deactivate()
      mounted.destroy()
    })
  }
}
