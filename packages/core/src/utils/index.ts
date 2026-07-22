export function warn(message: string): void {
  console.warn(`[alpine-primitives] ${message}`)
}

export function noop(): void {}

/** Coerce Alpine expression values that represent booleans loosely. */
export function toBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === '' || value === 1
}
