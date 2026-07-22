import { Keys } from '../keyboard'
import { getDirection, type Direction } from '../direction'

/**
 * Roving tabindex group. Exactly one item is in the tab sequence
 * (`tabindex="0"`); the rest are `tabindex="-1"`. Arrow keys move focus (and
 * the tab stop) between items, honoring orientation, wrapping, and RTL.
 *
 * Items are discovered live from the DOM in document order via `itemSelector`,
 * so adding/removing items needs no re-registration.
 */

export type Orientation = 'horizontal' | 'vertical' | 'both'

export interface RovingFocusOptions {
  itemSelector: string
  orientation?: Orientation
  loop?: boolean
  dir?: Direction
  /** Skip items matching this selector (e.g. `[aria-disabled="true"]`). */
  disabledSelector?: string
  /** Called after focus moves to an item (for aria-activedescendant, etc.). */
  onFocusItem?(el: HTMLElement, index: number): void
}

export interface RovingFocusGroup {
  activate(): void
  deactivate(): void
  focusItem(index: number): void
  focusFirst(): void
  focusLast(): void
  items(): HTMLElement[]
  sync(): void
}

const NEXT_KEYS: Record<string, boolean> = {
  [Keys.ArrowDown]: true,
  [Keys.ArrowRight]: true,
}
const PREV_KEYS: Record<string, boolean> = {
  [Keys.ArrowUp]: true,
  [Keys.ArrowLeft]: true,
}

export function createRovingFocus(
  container: HTMLElement,
  options: RovingFocusOptions,
): RovingFocusGroup {
  const {
    itemSelector,
    orientation = 'vertical',
    loop = true,
    disabledSelector,
    onFocusItem,
  } = options

  function items(): HTMLElement[] {
    const all = Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
    return disabledSelector ? all.filter((el) => !el.matches(disabledSelector)) : all
  }

  function setTabStops(activeIndex: number): void {
    items().forEach((el, i) => {
      el.setAttribute('tabindex', i === activeIndex ? '0' : '-1')
    })
  }

  function focusItem(index: number): void {
    const list = items()
    if (list.length === 0) return
    const clamped = Math.max(0, Math.min(index, list.length - 1))
    setTabStops(clamped)
    const el = list[clamped]
    el.focus()
    onFocusItem?.(el, clamped)
  }

  function currentIndex(): number {
    const list = items()
    const active = document.activeElement as HTMLElement | null
    const idx = active ? list.indexOf(active) : -1
    return idx
  }

  function move(delta: number): void {
    const list = items()
    if (list.length === 0) return
    const from = currentIndex()
    let next = from + delta
    if (from === -1) next = delta > 0 ? 0 : list.length - 1

    if (next < 0) next = loop ? list.length - 1 : 0
    else if (next >= list.length) next = loop ? 0 : list.length - 1

    focusItem(next)
  }

  function relevantAxis(key: string): boolean {
    const horizontalKey = key === Keys.ArrowLeft || key === Keys.ArrowRight
    const verticalKey = key === Keys.ArrowUp || key === Keys.ArrowDown
    if (orientation === 'both') return horizontalKey || verticalKey
    if (orientation === 'horizontal') return horizontalKey
    return verticalKey
  }

  function onKeydown(event: KeyboardEvent): void {
    const { key } = event
    const dir = options.dir ?? getDirection(container)

    if (key === Keys.Home) {
      event.preventDefault()
      focusItem(0)
      return
    }
    if (key === Keys.End) {
      event.preventDefault()
      focusItem(items().length - 1)
      return
    }

    if (!relevantAxis(key)) return
    event.preventDefault()

    let delta = NEXT_KEYS[key] ? 1 : PREV_KEYS[key] ? -1 : 0
    // In RTL, horizontal arrows are mirrored.
    if (dir === 'rtl' && (key === Keys.ArrowLeft || key === Keys.ArrowRight)) {
      delta = key === Keys.ArrowLeft ? 1 : -1
    }

    move(delta)
  }

  return {
    activate() {
      container.addEventListener('keydown', onKeydown)
      const list = items()
      const active = list.findIndex((el) => el.getAttribute('tabindex') === '0')
      setTabStops(active === -1 ? 0 : active)
    },
    deactivate() {
      container.removeEventListener('keydown', onKeydown)
    },
    focusItem,
    focusFirst: () => focusItem(0),
    focusLast: () => focusItem(items().length - 1),
    items,
    sync: () => {
      const list = items()
      const active = list.findIndex((el) => el.getAttribute('tabindex') === '0')
      setTabStops(active === -1 ? 0 : active)
    },
  }
}
