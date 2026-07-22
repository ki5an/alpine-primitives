import type { AlpineGlobal, DirectiveCallback } from '@alpine-primitives/core'
import { useTooltipContext, requireContext } from '../context'

/** `x-tooltip-arrow` — optional pointer, positioned by the content directive. */
export function arrow(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useTooltipContext(el)
    if (!requireContext(ctx, 'x-tooltip-arrow')) return
    ctx.arrowEl = el
    el.setAttribute('data-tooltip-arrow', '')
    el.style.position = 'absolute'
  }
}
