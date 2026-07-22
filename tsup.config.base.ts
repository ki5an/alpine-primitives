import { defineConfig, type Options } from 'tsup'

// In `--watch` (dev) mode, never wipe dist: the playground's Vite server runs
// concurrently and will fail to resolve the workspace entry if dist vanishes
// mid-rebuild. Clean only for one-shot production builds.
const watching = process.argv.includes('--watch') || process.argv.includes('-w')

export const baseConfig: Options = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: !watching,
  sourcemap: true,
  treeshake: true,
  external: ['alpinejs'],
}

export default defineConfig(baseConfig)
