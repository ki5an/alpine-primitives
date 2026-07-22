import {
  setAttribute,
  applyPresence,
  portalToBody,
  addListener,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useAlertDialogContext, requireContext } from '../context'

/** `x-alert-dialog-trigger` — opens the alert dialog. */
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

/** `x-alert-dialog-overlay` — backdrop. Portalled; not click-dismissable. */
export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-overlay')) return
    el.setAttribute('data-alert-dialog-overlay', '')
    applyPresence(el, ctx.open)
    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })
    effect(() => applyPresence(el, ctx.open))
    cleanup(() => undoPortal())
  }
}

/** `x-alert-dialog-title` — accessible name (`aria-labelledby`). */
export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}

/** `x-alert-dialog-description` — accessible description (`aria-describedby`). */
export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}

/** `x-alert-dialog-action` — confirms and closes. Add your logic via `@click`. */
export function action(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-action')) return
    el.setAttribute('data-alert-dialog-action', '')
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}

/** `x-alert-dialog-cancel` — dismisses; receives initial focus. */
export function cancel(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useAlertDialogContext(el)
    if (!requireContext(ctx, 'x-alert-dialog-cancel')) return
    ctx.cancelEl = el
    el.setAttribute('data-alert-dialog-cancel', '')
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}
