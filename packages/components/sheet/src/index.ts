import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { useSheetContext } from './context'
import { root } from './directives/root'
import { content } from './directives/content'
import { trigger, overlay, close, title, description } from './directives/parts'

/**
 * Alpine plugin for the sheet primitive:
 *   x-sheet, x-sheet-trigger, x-sheet-overlay, x-sheet-content,
 *   x-sheet-close, x-sheet-title, x-sheet-description
 * plus the `$sheet` magic.
 */
export const sheet: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('sheet', root(Alpine))
  Alpine.directive('sheet-trigger', trigger(Alpine))
  Alpine.directive('sheet-overlay', overlay(Alpine))
  Alpine.directive('sheet-content', content(Alpine))
  Alpine.directive('sheet-close', close(Alpine))
  Alpine.directive('sheet-title', title(Alpine))
  Alpine.directive('sheet-description', description(Alpine))

  Alpine.magic('sheet', (el) => useSheetContext(el) ?? {})
}

export default sheet

export { SHEET_CONTEXT, useSheetContext } from './context'
export type { SheetContext } from './context'
