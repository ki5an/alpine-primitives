export function portalToBody(el: HTMLElement, target: HTMLElement = document.body): () => void {
  const placeholder = document.createComment('alpine-primitives-portal')
  el.parentNode?.insertBefore(placeholder, el)
  target.appendChild(el)

  return () => {
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(el, placeholder)
      placeholder.remove()
    } else {
      el.remove()
    }
  }
}

export interface LazyPortal {
  mount(): void
  unmount(): void
}

export function createLazyPortal(el: HTMLElement, target?: HTMLElement): LazyPortal {
  let undo: () => void = () => {}
  let mounted = false
  return {
    mount() {
      if (mounted) return
      mounted = true
      undo = target ? portalToBody(el, target) : portalToBody(el)
    },
    unmount() {
      undo()
      undo = () => {}
      mounted = false
    },
  }
}
