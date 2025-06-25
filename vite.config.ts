import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssNesting from 'postcss-nesting'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/yoshiko-pg.github.io/',
  css: {
    postcss: {
      plugins: [
        postcssNesting(),
      ],
    },
  },
})
