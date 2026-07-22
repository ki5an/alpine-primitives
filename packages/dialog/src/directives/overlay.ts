import {
  applyPresence,
  portalToBody,
  addListener,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

/**
 * `x-dialog-overlay` — the backdrop. Portals to `<body>` (place it before
 * `x-dialog-content` in markup so it renders behind). Clicking it dismisses a
 * modal dialog.
 */
export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-overlay')) return

    el.setAttribute('data-dialog-overlay', '')
    applyPresence(el, ctx.open)

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    effect(() => applyPresence(el, ctx.open))

    const stop = addListener(el, 'click', () => {
      if (ctx.modal) ctx.setOpen(false)
    })

    cleanup(() => {
      stop()
      undoPortal()
    })
  }
}
