import { injectContext, warn, type Placement } from '@alpine-primitives/core'

export const POPOVER_CONTEXT = '_xPopoverContext'

export interface PopoverContext {
  open: boolean
  modal: boolean
  placement: Placement
  offset: number
  ids: { trigger: string; content: string }
  triggerEl: HTMLElement | null
  anchorEl: HTMLElement | null
  arrowEl: HTMLElement | null
  setOpen(value: boolean): void
  toggle(): void
}

export function usePopoverContext(el: HTMLElement): PopoverContext | null {
  return injectContext<PopoverContext>(el, POPOVER_CONTEXT)
}

export function requireContext(
  ctx: PopoverContext | null,
  directive: string,
): ctx is PopoverContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-popover element.`)
    return false
  }
  return true
}
