import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { usePopoverContext } from './context'
import { root } from './directives/root'
import { trigger } from './directives/trigger'
import { anchor } from './directives/anchor'
import { content } from './directives/content'
import { arrow } from './directives/arrow'
import { close } from './directives/close'

/**
 * Alpine plugin for the popover primitive:
 *   x-popover, x-popover-trigger, x-popover-anchor,
 *   x-popover-content, x-popover-arrow, x-popover-close
 * plus the `$popover` magic.
 */
export const popover: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('popover', root(Alpine))
  Alpine.directive('popover-trigger', trigger(Alpine))
  Alpine.directive('popover-anchor', anchor(Alpine))
  Alpine.directive('popover-content', content(Alpine))
  Alpine.directive('popover-arrow', arrow(Alpine))
  Alpine.directive('popover-close', close(Alpine))

  Alpine.magic('popover', (el) => usePopoverContext(el) ?? {})
}

export default popover

export { POPOVER_CONTEXT, usePopoverContext } from './context'
export type { PopoverContext } from './context'
