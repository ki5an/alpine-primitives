/**
 * An ordered registry of descendant items, kept in DOM order regardless of
 * registration order. Menus, listboxes, tabs, accordions use it to know their
 * items and each item's index for keyboard navigation and typeahead.
 */

export interface CollectionItem<T = unknown> {
  el: HTMLElement
  data: T
}

export interface Collection<T = unknown> {
  register(el: HTMLElement, data: T): () => void
  unregister(el: HTMLElement): void
  items(): CollectionItem<T>[]
  indexOf(el: HTMLElement): number
}

export function createCollection<T = unknown>(): Collection<T> {
  const map = new Map<HTMLElement, T>()

  function sorted(): CollectionItem<T>[] {
    return Array.from(map.entries())
      .map(([el, data]) => ({ el, data }))
      .sort((a, b) => {
        const position = a.el.compareDocumentPosition(b.el)
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
        return 0
      })
  }

  return {
    register(el, data) {
      map.set(el, data)
      return () => map.delete(el)
    },
    unregister(el) {
      map.delete(el)
    },
    items() {
      return sorted()
    },
    indexOf(el) {
      return sorted().findIndex((item) => item.el === el)
    },
  }
}
