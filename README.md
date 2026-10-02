# Darrel Lim ? Portfolio

Personal portfolio built with Vue 3, TypeScript, and Vite. Content is maintained in `src/data/`, with original images and documents in `public/`.

## Features

- Homepage showcases work experience, projects, credentials, and activities, with separate archive/detail pages and an About page with a journey timeline.
- Header light/dark switch; dark is the default, and the selected theme is saved locally.
- Carousel arrows, touch swipes, and mouse dragging. Autoplay uses a 12-second interval and pauses during interaction or when the page is hidden. Featured carousel transitions and autoplay remain enabled regardless of the OS animation setting.
- Mobile work/project cards fit their content and support 12-second autoplay, arrows, and swipes. Credentials and activities use a shared mobile group selector.
- Sticky return navigation and responsive section rails. Desktop journey years stay grouped in sticky buttons, alongside the vertical year rail on wide screens. The mobile journey heading stays above its sticky year selector. Section rails shrink at laptop widths and hide at viewport widths of 1200px or below.
- Responsive WebP images, lazy-loaded project/gallery images, and static PDF thumbnails. The homepage background also uses a generated, content-hashed WebP. Page code and styles load upfront so navigation does not wait for extra bundles. Other pages' images and PDFs are not prefetched.
- Homepage carousel images start when their section is nearby. Desktop side-card images remain available; on mobile, neighbouring work/project images are prepared after the active image and initial page load finish.
- Generated media includes tiny inline previews. The optional pre-rendered build sends page content before Vue loads, then attaches the existing interactive controls.

## Development

Use Node.js 22.12 or newer with npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Media generation runs automatically before the development server starts.

## Build and validation

```sh
npm run build
npm run preview
```

The build regenerates media, runs the Vue/TypeScript check, and produces the static site in `dist/`. Preview serves that production build locally.

To build the combined preview/pre-rendering experiment, use `npm run build:prerender`
instead of `npm run build`. It renders the homepage, archive/About pages, and known
experience details from the same Vue components. Upload all contents of `dist/`,
including the generated HTML pages and `.htaccess`, to Plesk. No Node server is
needed on the host. `npm run build` retains the client-rendered build for comparison.

For individual checks:

```sh
npm run type-check
npm run media
```

## Loading diagnostics

To investigate loading, open the site with `?diagnostics=1` and the browser Console.
Diagnostics log startup, resource/runtime failures, slow assets, page-render timings,
paint and supported long-task timings. Run `window.__portfolioDiagnostics.report()`
for a fresh report, or `copy(JSON.stringify(window.__portfolioDiagnostics.report(), null, 2))`
in Chrome DevTools to copy it. Pending lazy images are not necessarily failures;
cross-origin timing may be restricted. Logging is disabled without the query flag.
Use Network with an empty browser cache to compare fresh and cached visits.

## Content and media

- Edit portfolio content in `src/data/`: `work-experience.json`, `projects.json`, `certificates.json`, `achievements.json`, `about.json`, and `portfolio.ts`.
- Store original images and PDFs in `public/`, using root-relative references such as `/projects/Lunch_Box.jpg`.
- `scripts/generate-media.mjs` generates responsive WebP versions of referenced PNG/JPEG images and first-page PDF thumbnails. Original files and PDF links are preserved; PDF.js and canvas run during generation, not in visitors' browsers.
- Generation runs before `npm run dev` and `npm run build`. After changing content/media while the development server is already running, run `npm run media` or restart it.
- Generated files live in `public/generated-media/`, with their mapping in `src/data/media-assets.json`. Do not edit them manually. Source-content hashes refresh generated URLs when media changes.
- Commit original media, generated files, and their mapping together. Keep `node_modules/`, `dist/`, and local caches out of Git.

Implementation tracking and feedback are recorded in [codex-todo.md](codex-todo.md) and [codex-questions.md](codex-questions.md).

## Docker

```sh
docker build -t darrel-portfolio .
docker run --rm -p 8080:80 darrel-portfolio
```

Open `http://localhost:8080`. The Nginx configuration supports direct visits to portfolio routes such as `/about`, `/projects`, `/experience`, and `/certificates`.
