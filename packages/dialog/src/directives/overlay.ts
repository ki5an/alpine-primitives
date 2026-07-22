import {
  createPresence,
  portalToBody,
  addListener,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-overlay')) return

    el.setAttribute('data-dialog-overlay', '')
    const presence = createPresence(el, { initial: ctx.open })

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    effect(() => (ctx.open ? presence.show() : presence.hide()))

    const stop = addListener(el, 'click', () => {
      if (ctx.modal) ctx.setOpen(false)
    })

    cleanup(() => {
      stop()
      undoPortal()
    })
  }
}
