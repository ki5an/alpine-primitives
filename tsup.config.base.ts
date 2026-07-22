import { defineConfig, type Options } from 'tsup'

export const baseConfig: Options = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ['alpinejs'],
}

export default defineConfig(baseConfig)
