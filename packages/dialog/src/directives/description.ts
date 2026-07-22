import type { AlpineGlobal, DirectiveCallback } from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

/**
 * `x-dialog-description` — supplementary text. Its id is referenced by the
 * panel's `aria-describedby`. Honors an author-provided id if present.
 */
export function description(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-description')) return
    if (!el.id) el.id = ctx.ids.description
  }
}
