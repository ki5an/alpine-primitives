import {
  setAttribute,
  applyPresence,
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

/**
 * `x-dialog-content` — the dialog panel. Portals to `<body>`, applies the
 * `role="dialog"` semantics, traps focus, locks scroll (modal), and closes on
 * Escape. Open/closed is reflected via `data-state` for CSS transitions.
 */
export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-content')) return

    el.id = ctx.ids.content
    setAttribute(el, 'role', 'dialog')
    setAttribute(el, 'tabindex', '-1')
    setAttribute(el, 'aria-labelledby', ctx.ids.title)
    setAttribute(el, 'aria-describedby', ctx.ids.description)

    // Hide before first paint to avoid a flash of the open panel.
    applyPresence(el, ctx.open)

    const trap = createFocusTrap(el)
    let undoPortal = noop
    let unlockScroll = noop
    let removeEscape = noop

    // Portalling mutates the DOM; defer past Alpine's in-progress tree walk.
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    effect(() => {
      setAttribute(el, 'aria-modal', ctx.modal ? 'true' : null)
    })

    let wasOpen = ctx.open
    effect(() => {
      const open = ctx.open
      applyPresence(el, open)

      if (open && !wasOpen) {
        if (ctx.modal) unlockScroll = lockBodyScroll()
        removeEscape = onKey(document, Keys.Escape, (event) => {
          event.preventDefault()
          ctx.setOpen(false)
        })
        // Focus after the panel is shown & painted.
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
