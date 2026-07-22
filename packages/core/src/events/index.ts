/**
 * Dispatch a bubbling, cancelable CustomEvent. Returns `false` when a listener
 * called `preventDefault()`, letting callers treat the action as vetoed.
 */
export function dispatchEvent<T = unknown>(el: HTMLElement, name: string, detail?: T): boolean {
  return el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      cancelable: true,
      composed: true,
    }),
  )
}

export function addListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document | Window,
  type: K | string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions,
): () => void {
  target.addEventListener(type, handler as EventListener, options)
  return () => target.removeEventListener(type, handler as EventListener, options)
}
