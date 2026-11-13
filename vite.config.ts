import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer, defineConfig, loadEnv, type Plugin } from 'vite'
import {
  headTags,
  llmsTxt,
  pageForPath,
  pages,
  robotsTxt,
  sitemapXml,
} from './src/seo.ts'

const headMarker = /<!--head-->[\s\S]*?<!--\/head-->/
const emptyRoot = '<div id="root"></div>'

// Writes one HTML file per route with its own title, preview tags and
// prerendered content, so search engines and links shared on LinkedIn,
// WhatsApp & co. see the right page. Also writes the sitemap, robots.txt and
// llms.txt. The page at /404 becomes 404.html, which Vercel serves for unknown
// addresses.
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
              .replace('<html lang="en">', `<html lang="${page.lang ?? 'en'}">`)
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
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(join(outDir, 'sitemap.xml'), sitemapXml(today))
      writeFileSync(join(outDir, 'llms.txt'), llmsTxt())
      writeFileSync(join(outDir, 'robots.txt'), robotsTxt())
    },
  }
}

// Vercel runs the files in api/ in production. This runs the same files
// during `npm run dev`, so the form on /start and the client review pages can
// be tested on your own machine.
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(
        process.env,
        loadEnv('development', process.cwd(), ['RESEND_', 'LEAD_', 'REVIEWS_']),
      )
      for (const name of ['lead', 'review']) {
        server.middlewares.use(`/api/${name}`, async (req, res) => {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk)
          const { default: handler } = await server.ssrLoadModule(
            `/api/${name}.ts`,
          )
          const response: Response = await handler.fetch(
            new Request(`http://localhost/api/${name}${req.url ?? ''}`, {
              method: req.method,
              body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
            }),
          )
          res.statusCode = response.status
          res.setHeader('content-type', 'application/json')
          res.end(await response.text())
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pageHeads(), devApi()],
})
