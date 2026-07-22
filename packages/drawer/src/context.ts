import { injectContext, warn, type Side } from '@alpine-primitives/core'

export const DRAWER_CONTEXT = '_xDrawerContext'

export interface DrawerContext {
  open: boolean
  side: Side
  modal: boolean
  /** Drag distance (px) past which release dismisses the drawer. */
  dismissThreshold: number
  ids: { trigger: string; content: string; title: string; description: string }
  triggerEl: HTMLElement | null
  contentEl: HTMLElement | null
  setOpen(value: boolean): void
  toggle(): void
}

export function useDrawerContext(el: HTMLElement): DrawerContext | null {
  return injectContext<DrawerContext>(el, DRAWER_CONTEXT)
}

export function requireContext(ctx: DrawerContext | null, directive: string): ctx is DrawerContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-drawer element.`)
    return false
  }
  return true
}

const SIDES: Side[] = ['top', 'right', 'bottom', 'left']

export function sideFromModifiers(modifiers: string[], fallback: Side): Side {
  return SIDES.find((s) => modifiers.includes(s)) ?? fallback
}
