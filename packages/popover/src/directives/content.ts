import {
  setAttribute,
  applyPresence,
  portalToBody,
  computePosition,
  applyPosition,
  autoUpdate,
  createDismissableLayer,
  createFocusTrap,
  getFocusableElements,
  lockBodyScroll,
  addListener,
  noop,
  type Side,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { usePopoverContext, requireContext } from '../context'

const ARROW_PADDING = 8

/**
 * `x-popover-content` — the floating panel. Portals to `<body>`, positions with
 * the Floating engine (+ optional arrow), dismisses on outside press / Escape,
 * and manages focus. Set `.modal` on the root for scroll-lock + focus-trap.
 */
export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = usePopoverContext(el)
    if (!requireContext(ctx, 'x-popover-content')) return

    el.id = ctx.ids.content
    setAttribute(el, 'role', 'dialog')
    setAttribute(el, 'tabindex', '-1')
    if (ctx.modal) setAttribute(el, 'aria-modal', 'true')
    applyPresence(el, ctx.open)

    let undoPortal = noop
    Alpine.nextTick(() => {
      undoPortal = portalToBody(el)
    })

    const trap = createFocusTrap(el)
    const layer = createDismissableLayer(el, {
      onDismiss: () => ctx.setOpen(false),
    })

    let stopAutoUpdate = noop
    let unlockScroll = noop
    let removeFocusOut = noop

    function positionArrow(anchorEl: HTMLElement, side: Side): void {
      const arrow = ctx!.arrowEl
      if (!arrow) return
      const content = el.getBoundingClientRect()
      const anchor = anchorEl.getBoundingClientRect()
      const aw = arrow.offsetWidth
      const ah = arrow.offsetHeight

      if (side === 'top' || side === 'bottom') {
        const center = anchor.left + anchor.width / 2 - content.left - aw / 2
        const max = content.width - aw - ARROW_PADDING
        arrow.style.left = `${Math.min(Math.max(center, ARROW_PADDING), Math.max(ARROW_PADDING, max))}px`
        arrow.style.top = side === 'bottom' ? `${-ah / 2}px` : `${content.height - ah / 2}px`
      } else {
        const center = anchor.top + anchor.height / 2 - content.top - ah / 2
        const max = content.height - ah - ARROW_PADDING
        arrow.style.top = `${Math.min(Math.max(center, ARROW_PADDING), Math.max(ARROW_PADDING, max))}px`
        arrow.style.left = side === 'right' ? `${-aw / 2}px` : `${content.width - aw / 2}px`
      }
    }

    function update(): void {
      const anchorEl = ctx!.anchorEl ?? ctx!.triggerEl
      if (!anchorEl) return
      const result = computePosition(anchorEl, el, {
        placement: ctx!.placement,
        offset: ctx!.offset,
      })
      applyPosition(el, result)
      positionArrow(anchorEl, result.side)
    }

    function open(): void {
      applyPresence(el, true)
      requestAnimationFrame(() => {
        stopAutoUpdate = autoUpdate(ctx!.anchorEl ?? ctx!.triggerEl ?? el, el, update)
        layer.activate()
        if (ctx!.modal) {
          unlockScroll = lockBodyScroll()
          trap.activate()
        } else {
          const focusable = getFocusableElements(el)
          ;(focusable[0] ?? el).focus()
          removeFocusOut = addListener(el, 'focusout', (event) => {
            const next = (event as FocusEvent).relatedTarget as Node | null
            if (next && (el.contains(next) || ctx!.triggerEl?.contains(next))) return
            ctx!.setOpen(false)
          })
        }
      })
    }

    function close(): void {
      stopAutoUpdate()
      stopAutoUpdate = noop
      layer.deactivate()
      unlockScroll()
      unlockScroll = noop
      removeFocusOut()
      removeFocusOut = noop
      if (ctx!.modal) trap.deactivate()
      const active = document.activeElement
      if (active && el.contains(active)) ctx!.triggerEl?.focus()
      applyPresence(el, false)
    }

    let wasOpen = ctx.open
    effect(() => {
      const isOpen = ctx.open
      if (isOpen && !wasOpen) open()
      else if (!isOpen && wasOpen) close()
      wasOpen = isOpen
    })

    cleanup(() => {
      close()
      undoPortal()
    })
  }
}
