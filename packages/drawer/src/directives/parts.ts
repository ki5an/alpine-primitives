import {
  setAttribute,
  applyPresence,
  portalToBody,
  addListener,
  noop,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDrawerContext, requireContext } from '../context'

/** `x-drawer-trigger` — toggles the drawer. */
export function trigger(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-trigger')) return
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

/** `x-drawer-overlay` — backdrop; clicking it dismisses a modal drawer. */
export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-overlay')) return
    el.setAttribute('data-drawer-overlay', '')
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

/** `x-drawer-close` — closes the drawer. */
export function close(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-close')) return
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}

/** `x-drawer-title` — accessible name (`aria-labelledby`). */
export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}

/** `x-drawer-description` — accessible description (`aria-describedby`). */
export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}
