export type PresenceState = 'open' | 'closed'

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

export function createPresence(
  el: HTMLElement,
  options: { initial?: boolean; onExited?: () => void } = {},
): PresenceController {
  const inline = el.style.display
  const originalDisplay = inline && inline !== 'none' ? inline : ''
  const initialOpen = options.initial ?? inline !== 'none'
  let present = initialOpen
  let token = 0

  el.setAttribute('data-state', initialOpen ? 'open' : 'closed')
  el.style.display = initialOpen ? originalDisplay : 'none'

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
      if (present && el.getAttribute('data-state') === 'open') {
        el.style.display = originalDisplay
        return
      }
      present = true
      el.style.display = originalDisplay
      el.getBoundingClientRect()
      el.setAttribute('data-state', 'open')
    },
    hide() {
      if (!present) {
        token += 1
        el.setAttribute('data-state', 'closed')
        el.style.display = 'none'
        return
      }
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
