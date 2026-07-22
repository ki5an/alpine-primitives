import { warn } from '../utils'
import { provideContext } from '../context'
import type { AlpineGlobal } from '../types'
import type { LazyPortal } from '../portal'

/**
 * A content subtree instantiated from a `<template>` and portalled to the body.
 *
 * Authoring content inside a `<template>` keeps it out of the document until
 * the primitive mounts it: nothing renders (and nothing flashes) before Alpine
 * initializes, and no CSS `display:none` guard is required from the consumer.
 */
export interface MountedTemplate {
  /** The cloned root element (the template's single child), detached until mounted. */
  root: HTMLElement
  /** Portal that appends/removes `root` on the target, safe against Alpine's observer. */
  portal: LazyPortal
  /** Detach and tear down the subtree. Call from the directive's cleanup. */
  destroy(): void
}

export interface MountTemplateOptions {
  /** Context key to re-seed on the clone so descendants can inject it post-portal. */
  contextKey?: string
  /** The context value to provide under `contextKey`. */
  context?: unknown
  /** Portal target. Defaults to `document.body`. */
  target?: HTMLElement
}

/**
 * Clone a `<template>`'s single root child, preserve its Alpine scope, optionally
 * seed a context reference, and initialize it — returning a portal that mounts
 * the detached subtree into `target` (default `document.body`) on demand.
 *
 * Mirrors Alpine's own `x-teleport`: `addScopeToNode` preserves the authoring
 * data scope, and every DOM move runs inside `mutateDom` so the observer never
 * double-initializes the subtree.
 *
 * Returns `null` (with a warning) if `template` is not a `<template>` element or
 * has no element child — callers should bail.
 */
export function mountTemplate(
  Alpine: AlpineGlobal,
  template: HTMLElement,
  options: MountTemplateOptions = {},
): MountedTemplate | null {
  if (!(template instanceof HTMLTemplateElement)) {
    warn('content directive must be used on a <template> element.')
    return null
  }

  const source = template.content.firstElementChild
  if (!source) {
    warn('content <template> must contain a single root element.')
    return null
  }

  const root = source.cloneNode(true) as HTMLElement

  // Keep the authoring data scope so expressions inside the panel still resolve
  // after the subtree is moved to the body.
  Alpine.addScopeToNode(root, {}, template)

  // Re-seed context on the clone: descendants inject by walking parentElement,
  // which no longer reaches the provider once portalled out.
  if (options.contextKey !== undefined) {
    provideContext(root, options.contextKey, options.context)
  }

  // Initialize the detached clone with the observer paused.
  Alpine.mutateDom(() => Alpine.initTree(root))

  const target = options.target ?? document.body
  let mounted = false

  const portal: LazyPortal = {
    mount() {
      if (mounted) return
      mounted = true
      Alpine.mutateDom(() => target.appendChild(root))
    },
    unmount() {
      if (!mounted) return
      mounted = false
      Alpine.mutateDom(() => root.remove())
    },
  }

  return {
    root,
    portal,
    destroy() {
      portal.unmount()
      Alpine.mutateDom(() => Alpine.destroyTree(root))
    },
  }
}
