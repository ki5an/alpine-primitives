import type { AlpineGlobal, DirectiveCallback } from '@alpine-primitives/core'
import { usePopoverContext, requireContext } from '../context'

/**
 * `x-popover-anchor` — optional. Positions the content relative to this element
 * instead of the trigger (e.g. anchor to a whole input while a button toggles).
 */
export function anchor(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = usePopoverContext(el)
    if (!requireContext(ctx, 'x-popover-anchor')) return
    ctx.anchorEl = el
    el.setAttribute('data-popover-anchor', '')
  }
}
