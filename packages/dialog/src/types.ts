export interface DialogIds {
  trigger: string
  content: string
  title: string
  description: string
}

export interface DialogContext {
  open: boolean
  modal: boolean
  ids: DialogIds
  triggerEl: HTMLElement | null
  zIndex: { overlay: number; content: number } | null
  setOpen(value: boolean): void
  toggle(): void
}
