import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { headTags, pageForPath, pages } from './src/seo.ts'

const headMarker = /<!--head-->[\s\S]*?<!--\/head-->/

// Writes one HTML file per route with its own title and preview tags,
// so links shared on LinkedIn, WhatsApp & co. show the right page.
function pageHeads(): Plugin {
  let outDir = 'dist'
  return {
    name: 'page-heads',
    configResolved(config) {
      outDir = config.build.outDir
    },
    transformIndexHtml(html) {
      return html.replace(
        '<!--head-->',
        `<!--head-->\n    ${headTags(pageForPath('/'))}\n    <!--/head-->`,
      )
    },
    closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const page of pages) {
        if (page.path === '/') continue
        const file = join(outDir, `${page.path}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(
          file,
          html.replace(
            headMarker,
            `<!--head-->\n    ${headTags(page)}\n    <!--/head-->`,
          ),
        )
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pageHeads()],
})
