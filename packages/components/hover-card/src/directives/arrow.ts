import type { AlpineGlobal, DirectiveCallback } from '@alpine-primitives/core'
import { useHoverCardContext, requireContext } from '../context'

/** `x-hover-card-arrow` — optional pointer, positioned by the content directive. */
export function arrow(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useHoverCardContext(el)
    if (!requireContext(ctx, 'x-hover-card-arrow')) return
    ctx.arrowEl = el
    el.setAttribute('data-hover-card-arrow', '')
    el.style.position = 'absolute'
  }
}
