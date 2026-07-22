import {
  setAttribute,
  createPresence,
  mountTemplate,
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { SHEET_CONTEXT, useSheetContext, requireContext } from '../context'

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

export function overlay(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-overlay')) return
    const mounted = mountTemplate(Alpine, el, { contextKey: SHEET_CONTEXT, context: ctx })
    if (!mounted) return
    const { root, portal } = mounted
    root.setAttribute('data-sheet-overlay', '')
    const presence = createPresence(root, { initial: ctx.open })
    effect(() => {
      if (ctx.open) {
        portal.mount()
        presence.show()
      } else presence.hide()
    })
    cleanup(
      addListener(root, 'click', () => {
        if (ctx.modal) ctx.setOpen(false)
      }),
    )
    cleanup(() => mounted.destroy())
  }
}

export function close(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-close')) return
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}

export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}

export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useSheetContext(el)
    if (!requireContext(ctx, 'x-sheet-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}
