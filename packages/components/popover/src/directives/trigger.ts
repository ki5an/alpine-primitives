import {
  setAttribute,
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { usePopoverContext, requireContext } from '../context'

/** `x-popover-trigger` — toggles the popover; also the default anchor. */
export function trigger(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = usePopoverContext(el)
    if (!requireContext(ctx, 'x-popover-trigger')) return

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
