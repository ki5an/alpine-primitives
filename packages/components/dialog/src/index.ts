import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { useDialogContext } from './context'
import { root } from './directives/root'
import { trigger } from './directives/trigger'
import { content } from './directives/content'
import { overlay } from './directives/overlay'
import { close } from './directives/close'
import { title } from './directives/title'
import { description } from './directives/description'

/**
 * Alpine plugin registering the dialog primitive:
 *
 *   x-dialog, x-dialog-trigger, x-dialog-content, x-dialog-overlay,
 *   x-dialog-close, x-dialog-title, x-dialog-description
 *
 * and the `$dialog` magic (read `open`, call `setOpen`/`toggle`).
 */
export const dialog: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('dialog', root(Alpine))
  Alpine.directive('dialog-trigger', trigger(Alpine))
  Alpine.directive('dialog-content', content(Alpine))
  Alpine.directive('dialog-overlay', overlay(Alpine))
  Alpine.directive('dialog-close', close(Alpine))
  Alpine.directive('dialog-title', title(Alpine))
  Alpine.directive('dialog-description', description(Alpine))

  Alpine.magic('dialog', (el) => useDialogContext(el) ?? {})
}

export default dialog

export { DIALOG_CONTEXT, useDialogContext } from './context'
export { DialogEvents } from './events'
export type { DialogContext, DialogIds } from './types'
export type { DialogEventName } from './events'
