import {
  createPresence,
  mountTemplate,
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { DIALOG_CONTEXT, useDialogContext } from '../context'
import { requireContext } from '../utils'

export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-overlay')) return

    const mounted = mountTemplate(Alpine, el, {
      contextKey: DIALOG_CONTEXT,
      context: ctx,
    })
    if (!mounted) return
    const { root, portal } = mounted

    root.setAttribute('data-dialog-overlay', '')
    const presence = createPresence(root, { initial: ctx.open })

    effect(() => {
      if (ctx.open) {
        portal.mount()
        presence.show()
      } else presence.hide()
    })

    effect(() => {
      const z = ctx.zIndex
      if (z) root.style.zIndex = String(z.overlay)
    })

    const stop = addListener(root, 'click', () => {
      if (ctx.modal) ctx.setOpen(false)
    })

    cleanup(() => {
      stop()
      mounted.destroy()
    })
  }
}
