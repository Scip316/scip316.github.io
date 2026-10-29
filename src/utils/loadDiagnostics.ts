type DiagnosticError = { kind: string; atMs: number; message: string }
type DiagnosticState = {
  mounted: boolean
  errors: DiagnosticError[]
  report?: () => unknown
}

declare global {
  interface Window {
    __portfolioDiagnostics?: DiagnosticState
  }
}

const prefix = '[portfolio diagnostics]'
const ms = (value: number) => Math.round(value)
const resourceRow = (entry: PerformanceResourceTiming) => {
  const url = new URL(entry.name)
  const restricted = url.origin !== location.origin && entry.responseStart === 0
  return {
    url: url.origin + url.pathname,
    kind: entry.initiatorType,
    startedMs: ms(entry.startTime),
    totalMs: ms(entry.duration),
    waitForFirstByteMs: restricted ? null : ms(entry.responseStart - entry.requestStart),
    downloadMs: restricted ? null : ms(entry.responseEnd - entry.responseStart),
    transferBytes: restricted ? null : entry.transferSize,
    encodedBytes: restricted ? null : entry.encodedBodySize,
    decodedBytes: restricted ? null : entry.decodedBodySize,
    protocol: entry.nextHopProtocol,
    timingRestricted: restricted,
  }
}

export const startLoadDiagnostics = () => {
  const state = window.__portfolioDiagnostics
  if (!state) return
  performance.mark('portfolio:app-start')
  const report = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined
    const resources = (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
      .map(resourceRow)
      .sort((a, b) => b.totalMs - a.totalMs)
    const images = [...document.images].map((image) => {
      const rect = image.getBoundingClientRect()
      return {
        url: new URL(image.currentSrc || image.src, location.href).pathname,
        state: image.dataset.loadDeferred ? 'deferred' : image.complete ? (image.naturalWidth ? 'loaded' : 'failed/empty') : 'pending',
        loading: image.loading || 'eager',
        inViewport: rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth,
        width: image.naturalWidth,
      }
    })
    const summary = {
      path: location.pathname,
      mounted: state.mounted,
      document: navigation ? {
        dnsMs: ms(navigation.domainLookupEnd - navigation.domainLookupStart),
        connectionMs: ms(navigation.connectEnd - navigation.connectStart),
        firstByteMs: ms(navigation.responseStart),
        downloadMs: ms(navigation.responseEnd - navigation.responseStart),
        domReadyMs: ms(navigation.domContentLoadedEventEnd),
        loadEventMs: ms(navigation.loadEventEnd),
      } : null,
      paint: performance.getEntriesByType('paint').map((entry) => ({ name: entry.name, atMs: ms(entry.startTime) })),
      resources,
      images,
      errors: [...state.errors],
    }
    console.groupCollapsed(`${prefix} Loading report: ${location.pathname}`)
    console.info('Document / paint timing', summary.document, summary.paint)
    console.table(resources)
    console.table(images)
    console.info('Errors', summary.errors)
    console.info('Pending lazy images may intentionally be deferred. Zero-byte same-origin transfers can be cached; cross-origin timing may be restricted. CSS backgrounds appear in the resource table.')
    console.groupEnd()
    return summary
  }
  state.report = report
  const supported = PerformanceObserver.supportedEntryTypes
  if (supported.includes('resource')) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
        if (entry.duration >= 1500) console.warn(`${prefix} Slow resource`, resourceRow(entry))
      }
    }).observe({ type: 'resource', buffered: true })
  }
  for (const type of ['largest-contentful-paint', 'longtask']) {
    if (!supported.includes(type)) continue
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.info(`${prefix} ${type}`, { atMs: ms(entry.startTime), durationMs: ms(entry.duration) })
      }
    }).observe({ type, buffered: true })
  }
  const onLoad = () => window.setTimeout(report, 0)
  if (document.readyState === 'complete') onLoad()
  else window.addEventListener('load', onLoad, { once: true })
  window.setTimeout(report, 10000)
}

export const markAppMounted = () => {
  const state = window.__portfolioDiagnostics
  if (!state) return
  state.mounted = true
  performance.mark('portfolio:app-mounted')
  console.info(`${prefix} App mounted`, { atMs: ms(performance.now()) })
}

export const logNavigation = (started: number) => {
  if (!window.__portfolioDiagnostics) return
  console.info(`${prefix} Page rendered`, { path: location.pathname, renderMs: ms(performance.now() - started) })
}

export const recordVueError = (error: unknown, info: string) => {
  const state = window.__portfolioDiagnostics
  if (!state) return
  if (state.errors.length === 100) state.errors.shift()
  state.errors.push({
    kind: 'Vue error',
    atMs: ms(performance.now()),
    message: `${info}: ${error instanceof Error ? error.message : String(error)}`,
  })
  console.error(`${prefix} Vue error (${info})`, error)
}
