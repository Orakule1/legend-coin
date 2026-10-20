import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Fills the placeholder comments in index.html (no site.json needed).
function siteShell(title: string): Plugin {
  return {
    name: 'site-shell',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const result = html
          .replace('<!-- figma:lang -->', 'en')
          .replace('<!-- figma:title -->', title)
          .replace(/<!-- figma:(head-start|head-end|body-start|body-end) -->/g, '')
        return {
          html: result,
          tags: [{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg' }, injectTo: 'head' }],
        }
      },
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), siteShell('Legend Coin')],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
