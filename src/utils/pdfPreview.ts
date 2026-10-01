import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Share completed/in-flight previews across galleries and route changes.
const previews = new Map<string, Promise<string>>()
let renderQueue: Promise<void> = Promise.resolve()

const renderPreview = async (path: string) => {
  let loadingTask: import('pdfjs-dist').PDFDocumentLoadingTask | undefined
  try {
    const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist')
    GlobalWorkerOptions.workerSrc = pdfWorkerUrl
    loadingTask = getDocument(path)
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const original = page.getViewport({ scale: 1 })
    const scale = Math.min(1.5, 1000 / Math.max(original.width, original.height))
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is unavailable')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    await page.render({ canvas, canvasContext: context, viewport }).promise
    return canvas.toDataURL('image/jpeg', 0.9)
  } finally {
    await loadingTask?.destroy()
  }
}

export const getPdfPreview = (path: string): Promise<string> => {
  const existing = previews.get(path)
  if (existing) return existing
  // Avoid multiple PDF workers/canvases competing during a scroll or page change.
  const preview = renderQueue.then(() => renderPreview(path))
  previews.set(path, preview)
  renderQueue = preview.then(
    () => {},
    () => {
      previews.delete(path)
    },
  )
  return preview
}
