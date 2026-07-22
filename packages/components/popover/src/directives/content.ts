import {
  setAttribute,
  createPresence,
  mountTemplate,
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
import { POPOVER_CONTEXT, usePopoverContext, requireContext } from '../context'

const ARROW_PADDING = 8

export function content(Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { effect, cleanup }) => {
    const ctx = usePopoverContext(el)
    if (!requireContext(ctx, 'x-popover-content')) return

    const mounted = mountTemplate(Alpine, el, {
      contextKey: POPOVER_CONTEXT,
      context: ctx,
    })
    if (!mounted) return
    const { root, portal } = mounted

    root.id = ctx.ids.content
    setAttribute(root, 'role', 'dialog')
    setAttribute(root, 'tabindex', '-1')
    if (ctx.modal) setAttribute(root, 'aria-modal', 'true')
    const presence = createPresence(root, { initial: ctx.open })

    const trap = createFocusTrap(root)
    const layer = createDismissableLayer(root, {
      onDismiss: () => ctx.setOpen(false),
    })

    let stopAutoUpdate = noop
    let unlockScroll = noop
    let removeFocusOut = noop

    function positionArrow(anchorEl: HTMLElement, side: Side): void {
      const arrow = ctx!.arrowEl
      if (!arrow) return
      const content = root.getBoundingClientRect()
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
      const result = computePosition(anchorEl, root, {
        placement: ctx!.placement,
        offset: ctx!.offset,
      })
      applyPosition(root, result)
      positionArrow(anchorEl, result.side)
    }

    function open(): void {
      presence.show()
      requestAnimationFrame(() => {
        stopAutoUpdate = autoUpdate(ctx!.anchorEl ?? ctx!.triggerEl ?? root, root, update)
        layer.activate()
        if (ctx!.modal) {
          unlockScroll = lockBodyScroll()
          trap.activate()
        } else {
          const focusable = getFocusableElements(root)
          ;(focusable[0] ?? root).focus()
          removeFocusOut = addListener(root, 'focusout', (event) => {
            const next = (event as FocusEvent).relatedTarget as Node | null
            if (next && (root.contains(next) || ctx!.triggerEl?.contains(next))) return
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
      if (active && root.contains(active)) ctx!.triggerEl?.focus()
      presence.hide()
    }

    let wasOpen = ctx.open
    effect(() => {
      const isOpen = ctx.open
      if (isOpen) portal.mount()
      if (isOpen && !wasOpen) open()
      else if (!isOpen && wasOpen) close()
      wasOpen = isOpen
    })

    cleanup(() => {
      close()
      mounted.destroy()
    })
  }
}
