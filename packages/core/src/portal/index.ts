/**
 * Move `el` to `document.body`, leaving a placeholder comment where it was.
 * The returned fn restores `el` to its original position. Useful for overlays
 * that must escape `overflow:hidden`/`transform` ancestors and stacking context.
 */
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
