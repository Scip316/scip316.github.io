import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { resolve, relative, extname, basename } from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { createCanvas, loadImage } from '@napi-rs/canvas'

const root = fileURLToPath(new URL('../', import.meta.url))
const publicDir = resolve(root, 'public')
const sample = process.argv.includes('--sample')
const outputDir = resolve(
  root,
  sample ? 'node_modules/.cache/media-sample' : 'public/generated-media',
)
await mkdir(outputDir, { recursive: true })
const sources = new Set()
const collect = (value) => {
  if (typeof value === 'string' && /^\/.+\.(png|jpe?g|pdf)$/i.test(value)) sources.add(value)
  else if (Array.isArray(value)) value.forEach(collect)
  else if (value && typeof value === 'object') Object.values(value).forEach(collect)
}
for (const file of ['projects', 'work-experience', 'certificates', 'achievements', 'about']) {
  collect(JSON.parse(await readFile(resolve(root, `src/data/${file}.json`), 'utf8')))
}
const selected = sample
  ? ['/work_experiences/DBS.png', '/certificates/aws-certified-cloud-practitioner-certificate.pdf']
  : [...sources].sort()
const manifest = {}
let pdfjs
const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
for (const source of selected) {
  const file = resolve(publicDir, source.slice(1))
  if (relative(publicDir, file).startsWith('..')) throw new Error(`Invalid media path: ${source}`)
  const data = await readFile(file)
  const pdf = extname(file).toLowerCase() === '.pdf'
  const hash = createHash('sha256')
    .update(data)
    .update('webp-v1-q85-640-1280-pdf1000')
    .digest('hex')
    .slice(0, 16)
  const stem = basename(file, extname(file))
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase()
  const names = [640, pdf ? 1000 : 1280].map((size) => `${stem}-${hash}-${size}.webp`)
  if (!(await Promise.all(names.map((name) => exists(resolve(outputDir, name))))).every(Boolean)) {
    let image, task
    try {
      if (pdf) {
        pdfjs ??= await import('pdfjs-dist/legacy/build/pdf.mjs')
        task = pdfjs.getDocument({ data: new Uint8Array(data), useSystemFonts: true })
        const document = await task.promise
        const page = await document.getPage(1)
        const base = page.getViewport({ scale: 1 })
        const viewport = page.getViewport({ scale: 1000 / Math.max(base.width, base.height) })
        image = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
        await page.render({ canvas: image, canvasContext: image.getContext('2d'), viewport })
          .promise
      } else image = await loadImage(data)
      for (const [index, size] of [640, pdf ? 1000 : 1280].entries()) {
        const scale = Math.min(1, size / Math.max(image.width, image.height))
        const canvas = createCanvas(
          Math.round(image.width * scale),
          Math.round(image.height * scale),
        )
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        await writeFile(resolve(outputDir, names[index]), await canvas.encode('webp', 85))
      }
    } finally {
      await task?.destroy()
    }
  }
  const [smallImage, largeImage] = await Promise.all(
    names.map((name) => loadImage(resolve(outputDir, name))),
  )
  manifest[source] = {
    smallWidth: smallImage.width,
    largeWidth: largeImage.width,
    small: `/generated-media/${names[0]}`,
    large: `/generated-media/${names[1]}`,
  }
  const sizes = await Promise.all(
    names.map(async (name) => (await readFile(resolve(outputDir, name))).length),
  )
  console.log(`${source}: ${data.length} B -> ${sizes.join(' / ')} B`)
}
if (!sample)
  await writeFile(
    resolve(root, 'src/data/media-assets.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  )
console.log(`${sample ? 'Sample' : 'Generated'}: ${selected.length} sources`)
