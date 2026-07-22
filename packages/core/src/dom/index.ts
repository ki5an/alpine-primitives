export function isHTMLElement(node: unknown): node is HTMLElement {
  return typeof HTMLElement !== 'undefined' && node instanceof HTMLElement
}

let idCounter = 0

/** Deterministic, collision-resistant id for aria wiring. */
export function generateId(prefix = 'ap'): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function setAttribute(el: Element, name: string, value: string | null | undefined): void {
  if (value === null || value === undefined) el.removeAttribute(name)
  else el.setAttribute(name, value)
}

/**
 * Prevent the document from scrolling while an overlay is open. Compensates
 * for the removed scrollbar to avoid layout shift. Returns a restore fn.
 */
export function lockBodyScroll(): () => void {
  const body = document.body
  const previousOverflow = body.style.overflow
  const previousPadding = body.style.paddingRight
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

  return () => {
    body.style.overflow = previousOverflow
    body.style.paddingRight = previousPadding
  }
}
