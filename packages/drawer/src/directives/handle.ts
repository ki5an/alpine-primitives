import {
  addListener,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useDrawerContext, requireContext } from '../context'

/**
 * `x-drawer-handle` — a grab affordance. Dragging it away from the anchored
 * edge translates the panel; releasing past `dismissThreshold` closes the
 * drawer, otherwise it snaps back.
 */
export function handle(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useDrawerContext(el)
    if (!requireContext(ctx, 'x-drawer-handle')) return

    el.setAttribute('data-drawer-handle', '')
    el.style.touchAction = 'none'

    let dragging = false
    let startX = 0
    let startY = 0
    let offset = 0

    const axisY = ctx.side === 'top' || ctx.side === 'bottom'

    function offsetFor(dx: number, dy: number): number {
      switch (ctx!.side) {
        case 'bottom':
          return Math.max(0, dy)
        case 'top':
          return Math.min(0, dy)
        case 'right':
          return Math.max(0, dx)
        case 'left':
          return Math.min(0, dx)
      }
    }

    function onPointerDown(event: PointerEvent): void {
      const content = ctx!.contentEl
      if (!content) return
      dragging = true
      startX = event.clientX
      startY = event.clientY
      offset = 0
      content.style.transition = 'none'
      el.setPointerCapture(event.pointerId)
    }

    function onPointerMove(event: PointerEvent): void {
      if (!dragging) return
      const content = ctx!.contentEl
      if (!content) return
      offset = offsetFor(event.clientX - startX, event.clientY - startY)
      content.style.transform = axisY ? `translateY(${offset}px)` : `translateX(${offset}px)`
    }

    function onPointerUp(event: PointerEvent): void {
      if (!dragging) return
      dragging = false
      const content = ctx!.contentEl
      if (content) {
        content.style.transition = ''
        content.style.transform = ''
      }
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
      if (Math.abs(offset) > ctx!.dismissThreshold) ctx!.setOpen(false)
    }

    cleanup(addListener(el, 'pointerdown', (e) => onPointerDown(e as PointerEvent)))
    cleanup(addListener(el, 'pointermove', (e) => onPointerMove(e as PointerEvent)))
    cleanup(addListener(el, 'pointerup', (e) => onPointerUp(e as PointerEvent)))
    cleanup(addListener(el, 'pointercancel', (e) => onPointerUp(e as PointerEvent)))
  }
}
