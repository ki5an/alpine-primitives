/**
 * Directive context sharing.
 *
 * A root directive `provide`s a (usually reactive) value on its element.
 * Descendant directives `inject` it by walking up the DOM tree until they
 * find the nearest ancestor that provided that key.
 *
 * Descendants must inject *before* they are teleported/portalled out of the
 * subtree — capture the returned reference in a closure and it stays valid.
 */

export function provideContext<T>(el: HTMLElement, key: string, value: T): T {
  Object.defineProperty(el, key, {
    value,
    configurable: true,
    enumerable: false,
    writable: true,
  })
  return value
}

export function injectContext<T>(el: HTMLElement, key: string): T | null {
  let node: HTMLElement | null = el
  while (node) {
    if (Object.prototype.hasOwnProperty.call(node, key)) {
      return (node as unknown as Record<string, T>)[key]
    }
    node = node.parentElement
  }
  return null
}
