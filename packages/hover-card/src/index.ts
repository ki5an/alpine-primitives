import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { useHoverCardContext } from './context'
import { root } from './directives/root'
import { trigger } from './directives/trigger'
import { content } from './directives/content'
import { arrow } from './directives/arrow'

/**
 * Alpine plugin for the hover-card primitive:
 *   x-hover-card, x-hover-card-trigger, x-hover-card-content, x-hover-card-arrow
 * plus the `$hoverCard` magic.
 */
export const hoverCard: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('hover-card', root(Alpine))
  Alpine.directive('hover-card-trigger', trigger(Alpine))
  Alpine.directive('hover-card-content', content(Alpine))
  Alpine.directive('hover-card-arrow', arrow(Alpine))

  Alpine.magic('hoverCard', (el) => useHoverCardContext(el) ?? {})
}

export default hoverCard

export { HOVER_CARD_CONTEXT, useHoverCardContext } from './context'
export type { HoverCardContext } from './context'
