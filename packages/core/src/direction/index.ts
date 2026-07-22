export type Direction = 'ltr' | 'rtl'

/**
 * Resolve an element's effective text direction. Reads the nearest `dir`
 * attribute up the tree, falling back to the computed style, then `ltr`.
 * RTL flips the meaning of ArrowLeft/ArrowRight in roving-focus groups.
 */
export function getDirection(el: HTMLElement): Direction {
  const closest = el.closest('[dir]')
  const attr = closest?.getAttribute('dir')?.toLowerCase()
  if (attr === 'rtl' || attr === 'ltr') return attr

  if (typeof getComputedStyle !== 'undefined') {
    const computed = getComputedStyle(el).direction
    if (computed === 'rtl') return 'rtl'
  }
  return 'ltr'
}
