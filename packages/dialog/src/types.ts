export interface DialogIds {
  trigger: string
  content: string
  title: string
  description: string
}

/**
 * Reactive state shared from the `x-dialog` root to every descendant part.
 * Created via `Alpine.reactive`, so reads inside `effect()` track changes.
 */
export interface DialogContext {
  open: boolean
  modal: boolean
  ids: DialogIds
  triggerEl: HTMLElement | null
  setOpen(value: boolean): void
  toggle(): void
}
