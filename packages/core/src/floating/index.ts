/**
 * A dependency-free positioning engine for floating elements (popovers,
 * tooltips, menus, selects). Computes viewport coordinates for a floating
 * element relative to an anchor, with `offset`, `flip` (collision-aware side
 * swap), and `shift` (clamp along the cross axis).
 *
 * Coordinates are viewport-relative — pair with `position: fixed`.
 */

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'
export type Placement = Side | `${Side}-${Align}`

export interface ComputePositionOptions {
  placement?: Placement
  /** Gap between anchor and floating element, in px. */
  offset?: number
  /** Minimum distance from the viewport edge when flipping/shifting, in px. */
  padding?: number
  /** Swap to the opposite side when the preferred side overflows. */
  flip?: boolean
  /** Clamp the cross-axis position to keep the element in view. */
  shift?: boolean
}

export interface ComputePositionResult {
  x: number
  y: number
  placement: Placement
  side: Side
  align: Align
}

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

function parsePlacement(placement: Placement): { side: Side; align: Align } {
  const [side, align = 'center'] = placement.split('-') as [Side, Align?]
  return { side, align: align ?? 'center' }
}

interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

function coordsFor(
  side: Side,
  align: Align,
  anchor: Rect,
  floatW: number,
  floatH: number,
  offset: number,
): { x: number; y: number } {
  let x = 0
  let y = 0

  switch (side) {
    case 'top':
      y = anchor.top - floatH - offset
      break
    case 'bottom':
      y = anchor.bottom + offset
      break
    case 'left':
      x = anchor.left - floatW - offset
      break
    case 'right':
      x = anchor.right + offset
      break
  }

  const horizontal = side === 'top' || side === 'bottom'
  if (horizontal) {
    if (align === 'start') x = anchor.left
    else if (align === 'end') x = anchor.right - floatW
    else x = anchor.left + anchor.width / 2 - floatW / 2
  } else {
    if (align === 'start') y = anchor.top
    else if (align === 'end') y = anchor.bottom - floatH
    else y = anchor.top + anchor.height / 2 - floatH / 2
  }

  return { x, y }
}

function overflowFor(x: number, y: number, w: number, h: number, vw: number, vh: number, pad: number): number {
  const overTop = pad - y
  const overLeft = pad - x
  const overRight = x + w - (vw - pad)
  const overBottom = y + h - (vh - pad)
  return Math.max(0, overTop) + Math.max(0, overLeft) + Math.max(0, overRight) + Math.max(0, overBottom)
}

export function computePosition(
  anchor: HTMLElement,
  floating: HTMLElement,
  options: ComputePositionOptions = {},
): ComputePositionResult {
  const { placement = 'bottom', offset = 8, padding = 8, flip = true, shift = true } = options

  const anchorRect = anchor.getBoundingClientRect() as Rect
  const floatW = floating.offsetWidth
  const floatH = floating.offsetHeight
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  let { side, align } = parsePlacement(placement)

  // flip: pick the side (preferred vs opposite) with the least overflow.
  if (flip) {
    const preferred = coordsFor(side, align, anchorRect, floatW, floatH, offset)
    const preferredOverflow = overflowFor(preferred.x, preferred.y, floatW, floatH, vw, vh, padding)

    if (preferredOverflow > 0) {
      const oppSide = OPPOSITE[side]
      const opp = coordsFor(oppSide, align, anchorRect, floatW, floatH, offset)
      const oppOverflow = overflowFor(opp.x, opp.y, floatW, floatH, vw, vh, padding)
      if (oppOverflow < preferredOverflow) side = oppSide
    }
  }

  let { x, y } = coordsFor(side, align, anchorRect, floatW, floatH, offset)

  // shift: clamp along the cross axis so the element stays within padding.
  if (shift) {
    const horizontal = side === 'top' || side === 'bottom'
    if (horizontal) {
      x = Math.min(Math.max(x, padding), Math.max(padding, vw - floatW - padding))
    } else {
      y = Math.min(Math.max(y, padding), Math.max(padding, vh - floatH - padding))
    }
  }

  return { x: Math.round(x), y: Math.round(y), placement, side, align }
}

/**
 * Recompute position on scroll, resize, and element size changes until the
 * returned cleanup fn is called. Fires `onUpdate` once immediately.
 */
export function autoUpdate(
  anchor: HTMLElement,
  floating: HTMLElement,
  onUpdate: () => void,
): () => void {
  let frame = 0
  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(onUpdate)
  }

  window.addEventListener('scroll', schedule, { capture: true, passive: true })
  window.addEventListener('resize', schedule, { passive: true })

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
  ro?.observe(anchor)
  ro?.observe(floating)

  onUpdate()

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', schedule, { capture: true } as EventListenerOptions)
    window.removeEventListener('resize', schedule)
    ro?.disconnect()
  }
}

/** Apply a computed position to the floating element using `position: fixed`. */
export function applyPosition(floating: HTMLElement, result: ComputePositionResult): void {
  floating.style.position = 'fixed'
  floating.style.left = `${result.x}px`
  floating.style.top = `${result.y}px`
  floating.setAttribute('data-side', result.side)
  floating.setAttribute('data-align', result.align)
}
