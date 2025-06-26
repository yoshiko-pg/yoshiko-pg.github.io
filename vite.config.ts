import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssNesting from 'postcss-nesting'
import prerender from 'vite-plugin-prerender'
import { talks } from './src/data/talks.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      staticDir: 'dist',
      routes: talks.map(talk => `/talks/${talk.slug}`),
      renderer: './script/prerender.ts'
    })
  ],
  css: {
    postcss: {
      plugins: [
        postcssNesting(),
      ],
    },
  },
})
