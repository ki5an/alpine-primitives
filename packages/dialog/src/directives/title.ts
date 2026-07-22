import type { AlpineGlobal, DirectiveCallback } from '@alpine-primitives/core'
import { useDialogContext } from '../context'
import { requireContext } from '../utils'

/**
 * `x-dialog-title` — the accessible name. Its id is referenced by the panel's
 * `aria-labelledby`. Honors an author-provided id if present.
 */
export function title(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el) => {
    const ctx = useDialogContext(el)
    if (!requireContext(ctx, 'x-dialog-title')) return
    if (!el.id) el.id = ctx.ids.title
  }
}
