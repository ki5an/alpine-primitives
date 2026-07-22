import {
  setAttribute,
  addListener,
  Keys,
  type AlpineGlobal,
  type DirectiveCallback,
} from '@alpine-primitives/core'
import { useTooltipContext, requireContext } from '../context'

/**
 * `x-tooltip-trigger` — the element the tooltip describes. Opens on
 * pointerenter (after `delay`) and focus (immediately, for keyboard users);
 * closes on leave, blur, Escape, or press.
 */
export function trigger(_Alpine: AlpineGlobal): DirectiveCallback {
  return (el, _directive, { cleanup }) => {
    const ctx = useTooltipContext(el)
    if (!requireContext(ctx, 'x-tooltip-trigger')) return

    ctx.triggerEl = el
    setAttribute(el, 'aria-describedby', ctx.ids.content)

    let openTimer = 0
    let closeTimer = 0

    const clearTimers = () => {
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    }
    const scheduleOpen = () => {
      clearTimers()
      openTimer = window.setTimeout(() => ctx.setOpen(true), ctx.delay)
    }
    const scheduleClose = () => {
      clearTimers()
      closeTimer = window.setTimeout(() => ctx.setOpen(false), ctx.closeDelay)
    }
    const openNow = () => {
      clearTimers()
      ctx.setOpen(true)
    }
    const closeNow = () => {
      clearTimers()
      ctx.setOpen(false)
    }

    cleanup(addListener(el, 'pointerenter', scheduleOpen))
    cleanup(addListener(el, 'pointerleave', scheduleClose))
    cleanup(addListener(el, 'focus', openNow))
    cleanup(addListener(el, 'blur', closeNow))
    cleanup(addListener(el, 'pointerdown', closeNow))
    cleanup(
      addListener(el, 'keydown', (event) => {
        if ((event as KeyboardEvent).key === Keys.Escape) closeNow()
      }),
    )
    cleanup(clearTimers)
  }
}
