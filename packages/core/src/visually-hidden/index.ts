/**
 * Visually hide an element while keeping it available to assistive tech.
 * Used for screen-reader-only labels, status regions, and hidden native inputs
 * backing custom controls.
 */

export const VISUALLY_HIDDEN_STYLE =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;' +
  'clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;'

export function applyVisuallyHidden(el: HTMLElement): void {
  el.setAttribute('style', VISUALLY_HIDDEN_STYLE + (el.getAttribute('style') ?? ''))
  el.setAttribute('data-visually-hidden', '')
}
