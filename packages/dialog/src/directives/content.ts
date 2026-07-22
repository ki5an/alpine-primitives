import {
  setAttribute,
  createPresence,
  portalToBody,
  createFocusTrap,
  lockBodyScroll,
  onKey,
  Keys,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-content')) return

    el.id = ctx.ids.content
    setAttribute(el, 'role', 'dialog')
    setAttribute(el, 'tabindex', '-1')
    setAttribute(el, 'aria-labelledby', ctx.ids.title)
    setAttribute(el, 'aria-describedby', ctx.ids.description)

    const presence = createPresence(el, { initial: ctx.open })

    const trap = createFocusTrap(el)
    let undoPortal = noop
    let unlockScroll = noop
    let removeEscape = noop

    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    effect(() => {
      setAttribute(el, 'aria-modal', ctx.modal ? 'true' : null)
    })

    let wasOpen = ctx.open
    effect(() => {
      const open = ctx.open
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
      undoPortal()
    })
  }
}
