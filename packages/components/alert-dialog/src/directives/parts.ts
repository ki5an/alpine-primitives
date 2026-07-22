import {
  setAttribute,
  createPresence,
  mountTemplate,
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { ALERT_DIALOG_CONTEXT, useAlertDialogContext, requireContext } from '../context'

export function trigger(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-trigger')) return
    ctx.triggerEl = el
    if (!el.id) el.id = ctx.ids.trigger
    setAttribute(el, 'aria-haspopup', 'dialog')
    setAttribute(el, 'aria-controls', ctx.ids.content)
    effect(() => {
      setAttribute(el, 'aria-expanded', String(ctx.open))
      el.setAttribute('data-state', ctx.open ? 'open' : 'closed')
    })
    cleanup(addListener(el, 'click', () => ctx.setOpen(true)))
  }
}

export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-overlay')) return
    const mounted = mountTemplate(Alpine, el, { contextKey: ALERT_DIALOG_CONTEXT, context: ctx })
    if (!mounted) return
    const { root, portal } = mounted
    root.setAttribute('data-alert-dialog-overlay', '')
    const presence = createPresence(root, { initial: ctx.open })
    effect(() => {
      if (ctx.open) {
        portal.mount()
        presence.show()
      } else presence.hide()
    })
    cleanup(() => mounted.destroy())
  }
}

export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}

export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}

export function action(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-action')) return
    el.setAttribute('data-alert-dialog-action', '')
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}

export function cancel(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-cancel')) return
    ctx.cancelEl = el
    el.setAttribute('data-alert-dialog-cancel', '')
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}
