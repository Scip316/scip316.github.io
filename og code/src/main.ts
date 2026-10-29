import './assets/main.css'
import './assets/hero.css'
import './assets/header.css'
import './assets/showcase.css'
import './assets/work-gallery.css'
import './assets/action-link.css'
import './assets/experience-pages.css'
import './assets/experience-pages-layout.css'

import { createApp, createSSRApp } from 'vue'
import App from './App.vue'
import { markAppMounted, recordVueError, startLoadDiagnostics } from './utils/loadDiagnostics'

startLoadDiagnostics()
const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const prerendered = document.getElementById('app')?.dataset.prerendered === pathname
const app = (prerendered ? createSSRApp : createApp)(App, {
  initialPath: window.location.pathname,
})
if (window.__portfolioDiagnostics) {
  app.config.errorHandler = (error, _instance, info) => recordVueError(error, info)
}
app.mount('#app')
markAppMounted()
