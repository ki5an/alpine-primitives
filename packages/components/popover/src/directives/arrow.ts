import type { AlpineGlobal, DirectiveCallback } from '@alpine-primitives/core'
import { usePopoverContext, requireContext } from '../context'

/**
 * `x-popover-arrow` — optional pointer. The content directive positions it on
 * each update via `left`/`top`; style it with CSS (e.g. a rotated square).
 */
export function arrow(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = usePopoverContext(el)
    if (!requireContext(ctx, 'x-popover-arrow')) return
    ctx.arrowEl = el
    el.setAttribute('data-popover-arrow', '')
    el.style.position = 'absolute'
  }
}
