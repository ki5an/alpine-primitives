import { injectContext, warn, type Placement } from '@alpine-primitives/core'

export const HOVER_CARD_CONTEXT = '_xHoverCardContext'

export interface HoverCardContext {
  open: boolean
  placement: Placement
  offset: number
  openDelay: number
  closeDelay: number
  ids: { content: string }
  triggerEl: HTMLElement | null
  arrowEl: HTMLElement | null
  setOpen(value: boolean): void
  scheduleOpen(): void
  scheduleClose(): void
  cancelTimers(): void
}

export function useHoverCardContext(el: HTMLElement): HoverCardContext | null {
  return injectContext<HoverCardContext>(el, HOVER_CARD_CONTEXT)
}

export function requireContext(
  ctx: HoverCardContext | null,
  directive: string,
): ctx is HoverCardContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-hover-card element.`)
    return false
  }
  return true
}
