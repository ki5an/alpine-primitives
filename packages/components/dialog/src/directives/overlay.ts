import {
  createPresence,
  createLazyPortal,
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

export function overlay(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-overlay')) return

    el.setAttribute('data-dialog-overlay', '')
    const presence = createPresence(el, { initial: ctx.open })
    const portal = createLazyPortal(el)

    effect(() => {
      if (ctx.open) {
        portal.mount()
        presence.show()
      } else presence.hide()
    })

    effect(() => {
      const z = ctx.zIndex
      if (z) el.style.zIndex = String(z.overlay)
    })

    const stop = addListener(el, 'click', () => {
      if (ctx.modal) ctx.setOpen(false)
    })

    cleanup(() => {
      stop()
      portal.unmount()
    })
  }
}
