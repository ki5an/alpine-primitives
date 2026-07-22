import { injectContext, warn, type Side } from '@alpine-primitives/core'

export const SHEET_CONTEXT = '_xSheetContext'

export interface SheetContext {
  open: boolean
  side: Side
  modal: boolean
  ids: { trigger: string; content: string; title: string; description: string }
  triggerEl: HTMLElement | null
  setOpen(value: boolean): void
  toggle(): void
}

export function useSheetContext(el: HTMLElement): SheetContext | null {
  return injectContext<SheetContext>(el, SHEET_CONTEXT)
}

export function requireContext(ctx: SheetContext | null, directive: string): ctx is SheetContext {
  if (!ctx) {
    warn(`${directive} must be used inside an x-sheet element.`)
    return false
  }
  return true
}

const SIDES: Side[] = ['top', 'right', 'bottom', 'left']

export function sideFromModifiers(modifiers: string[], fallback: Side): Side {
  return SIDES.find((s) => modifiers.includes(s)) ?? fallback
}
