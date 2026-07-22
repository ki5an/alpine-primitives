import {
  setAttribute,
  createPresence,
  mountTemplate,
  computePosition,
  applyPosition,
  autoUpdate,
  onKey,
  Keys,
  noop,
  type Side,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import {
  TOOLTIP_CONTEXT,
  useTooltipContext,
  requireContext,
  claimActive,
  releaseActive,
} from '../context'

const ARROW_PADDING = 8

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = useTooltipContext(el)
    if (!requireContext(ctx, 'x-tooltip-content')) return

    const mounted = mountTemplate(Alpine, el, {
      contextKey: TOOLTIP_CONTEXT,
      context: ctx,
    })
    if (!mounted) return
    const { root, portal } = mounted

    root.id = ctx.ids.content
    setAttribute(root, 'role', 'tooltip')
    root.style.pointerEvents = 'none'
    const presence = createPresence(root, { initial: ctx.open })

    let stopAutoUpdate = noop
    let removeEscape = noop
    const close = () => ctx.setOpen(false)

    function positionArrow(anchorEl: HTMLElement, side: Side): void {
      const arrow = ctx!.arrowEl
      if (!arrow) return
      const c = root.getBoundingClientRect()
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
      const result = computePosition(anchorEl, root, {
        placement: ctx!.placement,
        offset: ctx!.offset,
      })
      applyPosition(root, result)
      positionArrow(anchorEl, result.side)
    }

    function doOpen(): void {
      claimActive(close)
      presence.show()
      requestAnimationFrame(() => {
        stopAutoUpdate = autoUpdate(ctx!.triggerEl ?? root, root, update)
        removeEscape = onKey(document, Keys.Escape, close)
      })
    }

    function doClose(): void {
      releaseActive(close)
      stopAutoUpdate()
      stopAutoUpdate = noop
      removeEscape()
      removeEscape = noop
      presence.hide()
    }

    let wasOpen = ctx.open
    effect(() => {
      const isOpen = ctx.open
      if (isOpen) portal.mount()
      if (isOpen && !wasOpen) doOpen()
      else if (!isOpen && wasOpen) doClose()
      wasOpen = isOpen
    })

    cleanup(() => {
      doClose()
      mounted.destroy()
    })
  }
}
