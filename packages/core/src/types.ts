/**
 * A minimal, version-independent surface of the Alpine.js API used by
 * primitives. Defining it here decouples every primitive from the exact
 * `alpinejs` type-package version installed downstream.
 */

export interface AlpineGlobal {
  directive(name: string, callback: DirectiveCallback): DirectiveController
  magic(name: string, callback: (el: HTMLElement) => unknown): void
  reactive<T extends object>(obj: T): T
  effect(callback: () => void): unknown
  release(effect: unknown): void
  nextTick(callback?: () => void): Promise<void>
  bind(el: HTMLElement, bindings: Record<string, unknown>): void
  evaluate<T = unknown>(el: HTMLElement, expression: string, extras?: Record<string, unknown>): T
  plugin(callback: Plugin | Plugin[]): void
  store(name: string, value?: unknown): unknown
}

export interface DirectiveController {
  before(directive: string): void
}

export interface DirectiveData {
  /** Text after the colon, e.g. `content` in `x-dialog:content`. */
  value: string
  /** Modifiers after dots, e.g. `['outside']` in `x-dialog.outside`. */
  modifiers: string[]
  /** The attribute value / expression. */
  expression: string
}

export interface DirectiveUtilities {
  Alpine: AlpineGlobal
  effect(callback: () => void): unknown
  cleanup(callback: () => void): void
  evaluate<T = unknown>(expression: string, extras?: Record<string, unknown>): T
  evaluateLater<T = unknown>(
    expression: string,
  ): (receiver: (value: T) => void, extras?: Record<string, unknown>) => void
}

export type DirectiveCallback = (
  el: HTMLElement,
  directive: DirectiveData,
  utilities: DirectiveUtilities,
) => void

export type Plugin = (Alpine: AlpineGlobal) => void
