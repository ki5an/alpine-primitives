import type { AlpineGlobal, Plugin } from '@alpine-primitives/core'
import { useDrawerContext } from './context'
import { root } from './directives/root'
import { content } from './directives/content'
import { handle } from './directives/handle'
import { trigger, overlay, close, title, description } from './directives/parts'

/**
 * Alpine plugin for the drawer primitive:
 *   x-drawer, x-drawer-trigger, x-drawer-overlay, x-drawer-content,
 *   x-drawer-handle, x-drawer-close, x-drawer-title, x-drawer-description
 * plus the `$drawer` magic.
 */
export const drawer: Plugin = (Alpine: AlpineGlobal) => {
  Alpine.directive('drawer', root(Alpine))
  Alpine.directive('drawer-trigger', trigger(Alpine))
  Alpine.directive('drawer-overlay', overlay(Alpine))
  Alpine.directive('drawer-content', content(Alpine))
  Alpine.directive('drawer-handle', handle(Alpine))
  Alpine.directive('drawer-close', close(Alpine))
  Alpine.directive('drawer-title', title(Alpine))
  Alpine.directive('drawer-description', description(Alpine))

  Alpine.magic('drawer', (el) => useDrawerContext(el) ?? {})
}

export default drawer

export { DRAWER_CONTEXT, useDrawerContext } from './context'
export type { DrawerContext } from './context'
