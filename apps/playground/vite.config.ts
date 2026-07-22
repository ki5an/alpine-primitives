import { defineConfig } from 'vite'

// base: './' emits relative asset paths so the built demo works when opened
// from the filesystem (file://) or served from any sub-path, not just root.
export default defineConfig({
  base: './',
})
