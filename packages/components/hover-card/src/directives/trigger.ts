import {
  addListener,
  Keys,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useHoverCardContext, requireContext } from '../context'

/** `x-hover-card-trigger` — hover/focus target that reveals the card. */
export function trigger(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useHoverCardContext(el)
    if (!requireContext(ctx, 'x-hover-card-trigger')) return

    ctx.triggerEl = el
    el.setAttribute('data-hover-card-trigger', '')

    cleanup(addListener(el, 'pointerenter', () => ctx.scheduleOpen()))
    cleanup(addListener(el, 'pointerleave', () => ctx.scheduleClose()))
    cleanup(addListener(el, 'focus', () => ctx.setOpen(true)))
    cleanup(addListener(el, 'blur', () => ctx.scheduleClose()))
    cleanup(
      addListener(el, 'keydown', (event) => {
        if ((event as KeyboardEvent).key === Keys.Escape) ctx.setOpen(false)
      }),
    )
  }
}
