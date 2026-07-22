import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { useAlertDialogContext } from './context'
import { root } from './directives/root'
import { content } from './directives/content'
import {
  trigger,
  overlay,
  title,
  description,
  action,
  cancel,
} from './directives/parts'

/**
 * Alpine plugin for the alert-dialog primitive:
 *   x-alert-dialog, x-alert-dialog-trigger, x-alert-dialog-overlay,
 *   x-alert-dialog-content, x-alert-dialog-title, x-alert-dialog-description,
 *   x-alert-dialog-action, x-alert-dialog-cancel
 * plus the `$alertDialog` magic.
 */
export const alertDialog: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('alert-dialog', root(Alpine))
  Alpine.directive('alert-dialog-trigger', trigger(Alpine))
  Alpine.directive('alert-dialog-overlay', overlay(Alpine))
  Alpine.directive('alert-dialog-content', content(Alpine))
  Alpine.directive('alert-dialog-title', title(Alpine))
  Alpine.directive('alert-dialog-description', description(Alpine))
  Alpine.directive('alert-dialog-action', action(Alpine))
  Alpine.directive('alert-dialog-cancel', cancel(Alpine))

  Alpine.magic('alertDialog', (el) => useAlertDialogContext(el) ?? {})
}

export default alertDialog

export { ALERT_DIALOG_CONTEXT, useAlertDialogContext } from './context'
export type { AlertDialogContext } from './context'
