import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { useTooltipContext } from './context'
import { root } from './directives/root'
import { trigger } from './directives/trigger'
import { content } from './directives/content'
import { arrow } from './directives/arrow'

/**
 * Alpine plugin for the tooltip primitive:
 *   x-tooltip, x-tooltip-trigger, x-tooltip-content, x-tooltip-arrow
 * plus the `$tooltip` magic.
 */
export const tooltip: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('tooltip', root(Alpine))
  Alpine.directive('tooltip-trigger', trigger(Alpine))
  Alpine.directive('tooltip-content', content(Alpine))
  Alpine.directive('tooltip-arrow', arrow(Alpine))

  Alpine.magic('tooltip', (el) => useTooltipContext(el) ?? {})
}

export default tooltip

export { TOOLTIP_CONTEXT, useTooltipContext } from './context'
export type { TooltipContext } from './context'
