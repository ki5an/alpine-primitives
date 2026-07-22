export type PresenceState = 'open' | 'closed'

/**
 * Reflect open/closed state onto an element for both behavior and styling.
 * Sets `data-state` (targetable in CSS for enter/leave transitions) and toggles
 * visibility via inline `display`. When hidden, the previous inline display is
 * restored on show so author-set `display` values survive. Instant — no wait
 * for transitions. For leave animations, use `createPresence`.
 */
export function applyPresence(el: HTMLElement, open: boolean): void {
  el.setAttribute('data-state', open ? 'open' : 'closed')

  if (open) {
    const restored = el.dataset.apDisplay
    el.style.display = restored ?? ''
    delete el.dataset.apDisplay
  } else {
    if (el.style.display && el.style.display !== 'none') {
      el.dataset.apDisplay = el.style.display
    }
    el.style.display = 'none'
  }
}

export interface PresenceController {
  show(): void
  hide(): void
  isPresent(): boolean
}

/**
 * Presence with exit awareness: on `hide()`, sets `data-state="closed"` and
 * keeps the element mounted until its CSS transition/animation finishes, then
 * sets `display:none` and calls `onExited`. `show()` cancels a pending hide.
 */
export function createPresence(
  el: HTMLElement,
  options: { onExited?: () => void } = {},
): PresenceController {
  const originalDisplay = el.style.display === 'none' ? '' : el.style.display
  let present = el.style.display !== 'none'
  let token = 0

  function hasMotion(): boolean {
    if (typeof getComputedStyle === 'undefined') return false
    const cs = getComputedStyle(el)
    const transitionDur = parseFloat(cs.transitionDuration) || 0
    const animationDur = parseFloat(cs.animationDuration) || 0
    const hasAnimation = cs.animationName !== 'none' && animationDur > 0
    return transitionDur > 0 || hasAnimation
  }

  function finalize(myToken: number): void {
    if (myToken !== token) return
    present = false
    el.style.display = 'none'
    options.onExited?.()
  }

  return {
    show() {
      token += 1
      present = true
      el.style.display = originalDisplay
      el.setAttribute('data-state', 'open')
    },
    hide() {
      const myToken = (token += 1)
      el.setAttribute('data-state', 'closed')
      requestAnimationFrame(() => {
        if (myToken !== token) return
        if (!hasMotion()) {
          finalize(myToken)
          return
        }
        const onEnd = (event: Event) => {
          if (event.target !== el) return
          el.removeEventListener('transitionend', onEnd)
          el.removeEventListener('animationend', onEnd)
          finalize(myToken)
        }
        el.addEventListener('transitionend', onEnd)
        el.addEventListener('animationend', onEnd)
      })
    },
    isPresent: () => present,
  }
}
