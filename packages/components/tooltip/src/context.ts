import { injectContext, warn, type Placement } from '@alpine-primitives/core'

export const TOOLTIP_CONTEXT = '_xTooltipContext'

export interface TooltipContext {
  open: boolean
  placement: Placement
  offset: number
  delay: number
  closeDelay: number
  ids: { content: string }
  triggerEl: HTMLElement | null
  arrowEl: HTMLElement | null
  setOpen(value: boolean): void
}

export function useTooltipContext(el: HTMLElement): TooltipContext | null {
  return injectContext<TooltipContext>(el, TOOLTIP_CONTEXT)
}

export function requireContext(
  ctx: TooltipContext | null,
  directive: string,
): ctx is TooltipContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-tooltip element.`)
    return false
  }
  return true
}

/**
 * Only one tooltip is open at a time. Opening one closes the previous.
 */
let activeClose: (() => void) | null = null

export function claimActive(close: () => void): void {
  if (activeClose && activeClose !== close) activeClose()
  activeClose = close
}

export function releaseActive(close: () => void): void {
  if (activeClose === close) activeClose = null
}
