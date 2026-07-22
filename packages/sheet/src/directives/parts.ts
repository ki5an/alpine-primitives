import {
  setAttribute,
  applyPresence,
  portalToBody,
  addListener,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useSheetContext, requireContext } from '../context'

/** `x-sheet-trigger` — toggles the sheet. */
export function trigger(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-trigger')) return
    ctx.triggerEl = el
    if (!el.id) el.id = ctx.ids.trigger
    setAttribute(el, 'aria-haspopup', 'dialog')
    setAttribute(el, 'aria-controls', ctx.ids.content)
    effect(() => {
      setAttribute(el, 'aria-expanded', String(ctx.open))
      el.setAttribute('data-state', ctx.open ? 'open' : 'closed')
    })
    cleanup(addListener(el, 'click', () => ctx.toggle()))
  }
}

/** `x-sheet-overlay` — backdrop; clicking it dismisses a modal sheet. */
export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-overlay')) return
    el.setAttribute('data-sheet-overlay', '')
    applyPresence(el, ctx.open)
    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })
    effect(() => applyPresence(el, ctx.open))
    cleanup(
      addListener(el, 'click', () => {
        if (ctx.modal) ctx.setOpen(false)
      }),
    )
    cleanup(() => undoPortal())
  }
}

/** `x-sheet-close` — closes the sheet. */
export function close(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-close')) return
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}

/** `x-sheet-title` — accessible name (`aria-labelledby`). */
export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}

/** `x-sheet-description` — accessible description (`aria-describedby`). */
export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}
