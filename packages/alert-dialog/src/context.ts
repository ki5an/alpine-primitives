import { injectContext, warn } from '@alpine-primitives/core'

export const ALERT_DIALOG_CONTEXT = '_xAlertDialogContext'

export interface AlertDialogContext {
  open: boolean
  ids: { trigger: string; content: string; title: string; description: string }
  triggerEl: HTMLElement | null
  cancelEl: HTMLElement | null
  setOpen(value: boolean): void
  toggle(): void
}

export function useAlertDialogContext(el: HTMLElement): AlertDialogContext | null {
  return injectContext<AlertDialogContext>(el, ALERT_DIALOG_CONTEXT)
}

export function requireContext(
  ctx: AlertDialogContext | null,
  directive: string,
): ctx is AlertDialogContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-alert-dialog element.`)
    return false
  }
  return true
}
