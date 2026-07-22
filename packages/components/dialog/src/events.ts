/** Custom DOM events dispatched from the dialog root. Listen with `@dialog:open`. */
export const DialogEvents = {
  open: 'dialog:open',
  close: 'dialog:close',
} as const

export type DialogEventName = (typeof DialogEvents)[keyof typeof DialogEvents]
