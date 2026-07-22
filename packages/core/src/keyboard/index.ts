export const Keys = {
  Enter: 'Enter',
  Escape: 'Escape',
  Space: ' ',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
} as const

export type Key = (typeof Keys)[keyof typeof Keys]

/**
 * Attach a keydown listener that fires `handler` only for `key`. Returns an
 * unsubscribe fn.
 */
export function onKey(
  target: HTMLElement | Document,
  key: string,
  handler: (event: KeyboardEvent) => void,
): () => void {
  function listener(event: Event) {
    if ((event as KeyboardEvent).key === key) handler(event as KeyboardEvent)
  }
  target.addEventListener('keydown', listener)
  return () => target.removeEventListener('keydown', listener)
}
