import {
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { usePopoverContext, requireContext } from '../context'

/** `x-popover-close` — closes the popover when clicked. */
export function close(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = usePopoverContext(el)
    if (!requireContext(ctx, 'x-popover-close')) return
    cleanup(addListener(el, 'click', () => ctx.setOpen(false)))
  }
}
