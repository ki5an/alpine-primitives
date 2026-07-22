import { injectContext } from '@alpine-primitives/core'
import type { DialogContext } from './types'

/** Non-enumerable property key under which the root stores its context. */
export const DIALOG_CONTEXT = '_xDialogContext'

export function useDialogContext(el: HTMLElement): DialogContext | null {
  return injectContext<DialogContext>(el, DIALOG_CONTEXT)
}
