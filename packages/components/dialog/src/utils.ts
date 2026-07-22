import { warn } from '@alpine-primitives/core'
import type { DialogContext } from './types'

/**
 * Resolve the dialog context or emit a helpful warning. Returns null when a
 * part directive is used outside an `x-dialog` root so callers can bail early.
 */
export function requireContext(
  ctx: DialogContext | null,
  directive: string,
): ctx is DialogContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-dialog element.`)
    return false
  }
  return true
}
