import {
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

/** `x-dialog-close` — any element that closes the dialog when clicked. */
export function close(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-close')) return

    const stop = addListener(el, 'click', () => ctx.setOpen(false))
    cleanup(stop)
  }
}
