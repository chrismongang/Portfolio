import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import { headTags, pageForPath, pages, robotsTxt, sitemapXml } from './src/seo.ts'

const headMarker = /<!--head-->[\s\S]*?<!--\/head-->/
const emptyRoot = '<div id="root"></div>'

// Writes one HTML file per route with its own title, preview tags and
// prerendered content, so search engines and links shared on LinkedIn,
// WhatsApp & co. see the right page. Also writes the sitemap and robots.txt.
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
    async closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      const server = await createServer({
        configFile: false,
        appType: 'custom',
        server: { middlewareMode: true, hmr: false },
        plugins: [react()],
      })
      try {
        const { render } = await server.ssrLoadModule('/src/entry-server.tsx')
        for (const page of pages) {
          const file = join(
            outDir,
            page.path === '/' ? 'index.html' : `${page.path}.html`,
          )
          mkdirSync(dirname(file), { recursive: true })
          writeFileSync(
            file,
            html
              .replace(
                headMarker,
                `<!--head-->\n    ${headTags(page)}\n    <!--/head-->`,
              )
              .replace(emptyRoot, `<div id="root">${render(page.path)}</div>`),
          )
        }
      } finally {
        await server.close()
      }
      writeFileSync(join(outDir, 'sitemap.xml'), sitemapXml())
      writeFileSync(join(outDir, 'robots.txt'), robotsTxt())
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pageHeads()],
})
