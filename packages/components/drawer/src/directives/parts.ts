import {
  setAttribute,
  createPresence,
  createLazyPortal,
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDrawerContext, requireContext } from '../context'

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

export function overlay(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-overlay')) return
    el.setAttribute('data-drawer-overlay', '')
    const presence = createPresence(el, { initial: ctx.open })
    const portal = createLazyPortal(el)
    effect(() => {
      if (ctx.open) {
        portal.mount()
        presence.show()
      } else presence.hide()
    })
    cleanup(
      addListener(el, 'click', () => {
        if (ctx.modal) ctx.setOpen(false)
      }),
    )
    cleanup(() => portal.unmount())
  }
}

export function close(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-close')) return
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}

export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}

export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}
