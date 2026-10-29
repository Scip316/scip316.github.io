import { build } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Render the existing Vue components at build time; deployment remains static.
const output = resolve(process.argv[2] || 'dist')
const serverOutput = resolve('node_modules/.cache/prerender-server')
await build({
  build: { ssr: 'src/entry-server.ts', outDir: serverOutput, emptyOutDir: true },
})
const { render } = await import(pathToFileURL(resolve(serverOutput, 'entry-server.js')).href)
const template = await readFile(resolve(output, 'index.html'), 'utf8')
const experiences = JSON.parse(await readFile('src/data/work-experience.json', 'utf8'))
const routes = [
  '/',
  '/about',
  '/projects',
  '/experience',
  '/certificates',
  ...experiences.experiences
    .filter((item) => item.detailPageSlug)
    .map((item) => `/experience/${item.detailPageSlug}`),
]
for (const route of routes) {
  const content = await render(route)
  const html = template.replace(
    '<div id="app"></div>',
    `<div id="app" data-prerendered="${route}">${content}</div>`,
  )
  if (html === template) throw new Error('Missing empty app element in build template')
  const destination = resolve(output, route === '/' ? 'index.html' : `.${route}.html`)
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html)
  console.log(`Pre-rendered ${route}`)
}
