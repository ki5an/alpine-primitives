import {
  applyPresence,
  portalToBody,
  computePosition,
  applyPosition,
  autoUpdate,
  onKey,
  Keys,
  addListener,
  noop,
  type Side,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useHoverCardContext, requireContext } from '../context'

const ARROW_PADDING = 8

/**
 * `x-hover-card-content` — the floating card. Interactive: hovering it cancels
 * the close timer so users can move into and click within it.
 */
export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useHoverCardContext(el)
    if (!requireContext(ctx, 'x-hover-card-content')) return

    el.id = ctx.ids.content
    applyPresence(el, ctx.open)

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    let stopAutoUpdate = noop
    let removeEscape = noop
    const stopEnter = addListener(el, 'pointerenter', () => ctx.cancelTimers())
    const stopLeave = addListener(el, 'pointerleave', () => ctx.scheduleClose())

    function positionArrow(anchorEl: HTMLElement, side: Side): void {
      const arrow = ctx!.arrowEl
      if (!arrow) return
      const c = el.getBoundingClientRect()
      const a = anchorEl.getBoundingClientRect()
      const aw = arrow.offsetWidth
      const ah = arrow.offsetHeight
      if (side === 'top' || side === 'bottom') {
        const center = a.left + a.width / 2 - c.left - aw / 2
        const max = c.width - aw - ARROW_PADDING
        arrow.style.left = `${Math.min(Math.max(center, ARROW_PADDING), Math.max(ARROW_PADDING, max))}px`
        arrow.style.top = side === 'bottom' ? `${-ah / 2}px` : `${c.height - ah / 2}px`
      } else {
        const center = a.top + a.height / 2 - c.top - ah / 2
        const max = c.height - ah - ARROW_PADDING
        arrow.style.top = `${Math.min(Math.max(center, ARROW_PADDING), Math.max(ARROW_PADDING, max))}px`
        arrow.style.left = side === 'right' ? `${-aw / 2}px` : `${c.width - aw / 2}px`
      }
    }

    function update(): void {
      const anchorEl = ctx!.triggerEl
      if (!anchorEl) return
      const result = computePosition(anchorEl, el, {
        placement: ctx!.placement,
        offset: ctx!.offset,
      })
      applyPosition(el, result)
      positionArrow(anchorEl, result.side)
    }

    function doOpen(): void {
      applyPresence(el, true)
      requestAnimationFrame(() => {
        stopAutoUpdate = autoUpdate(ctx!.triggerEl ?? el, el, update)
        removeEscape = onKey(document, Keys.Escape, () => ctx!.setOpen(false))
      })
    }

    function doClose(): void {
      stopAutoUpdate()
      stopAutoUpdate = noop
      removeEscape()
      removeEscape = noop
      applyPresence(el, false)
    }

    let wasOpen = ctx.open
    effect(() => {
      const isOpen = ctx.open
      if (isOpen && !wasOpen) doOpen()
      else if (!isOpen && wasOpen) doClose()
      wasOpen = isOpen
    })

    cleanup(() => {
      stopEnter()
      stopLeave()
      doClose()
      undoPortal()
    })
  }
}
