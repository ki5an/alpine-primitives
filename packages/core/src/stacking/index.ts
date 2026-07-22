export const BASE_Z_INDEX = 50

const TIER_STEP = 10

let openCount = 0
let nextTier = 0

export interface ZIndexTier {
  overlay: number
  content: number
  release(): void
}

export function acquireZIndex(): ZIndexTier {
  const base = BASE_Z_INDEX + nextTier * TIER_STEP
  nextTier++
  openCount++

  let released = false
  return {
    overlay: base,
    content: base + 1,
    release() {
      if (released) return
      released = true
      openCount--
      if (openCount === 0) nextTier = 0
    },
  }
}
