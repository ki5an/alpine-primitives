/**
 * Dismissable layer stack.
 *
 * Overlays (dialogs, popovers, menus) register as layers. Escape dismisses only
 * the topmost layer; an outside pointer press dismisses the layer it fell
 * outside of. Both callbacks are cancelable via `preventDefault()` on the
 * passed event, letting a consumer veto the dismissal.
 */

export interface DismissableLayerOptions {
  /** Called on Escape (topmost layer only) or outside press. */
  onDismiss(): void
  /** Fired before dismissal on Escape; call `preventDefault()` to veto. */
  onEscapeKeyDown?(event: KeyboardEvent): void
  /** Fired before dismissal on outside press; call `preventDefault()` to veto. */
  onPointerDownOutside?(event: PointerEvent): void
}

export interface DismissableLayer {
  activate(): void
  deactivate(): void
}

const layerStack: HTMLElement[] = []

function isTopLayer(el: HTMLElement): boolean {
  return layerStack[layerStack.length - 1] === el
}

export function createDismissableLayer(
  el: HTMLElement,
  options: DismissableLayerOptions,
): DismissableLayer {
  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !isTopLayer(el)) return
    options.onEscapeKeyDown?.(event)
    if (event.defaultPrevented) return
    options.onDismiss()
  }

  function onPointerDown(event: PointerEvent) {
    const target = event.target as Node | null
    if (!isTopLayer(el)) return
    if (target && el.contains(target)) return
    options.onPointerDownOutside?.(event)
    if (event.defaultPrevented) return
    options.onDismiss()
  }

  return {
    activate() {
      if (!layerStack.includes(el)) layerStack.push(el)
      document.addEventListener('keydown', onKeydown)
      // Pointerdown on the document, deferred so the opening click doesn't
      // immediately dismiss the layer it just opened.
      requestAnimationFrame(() => {
        document.addEventListener('pointerdown', onPointerDown)
      })
    },
    deactivate() {
      const index = layerStack.indexOf(el)
      if (index !== -1) layerStack.splice(index, 1)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('pointerdown', onPointerDown)
    },
  }
}
