# Darrel Lim ? Portfolio

Personal portfolio built with Vue 3, TypeScript, and Vite. Content is maintained in `src/data/`, with original images and documents in `public/`.

## Features

- Homepage showcases work experience, projects, credentials, and activities, with separate archive/detail pages and an About page with a journey timeline.
- Header light/dark switch; dark is the default, and the selected theme is saved locally.
- Carousel arrows, touch swipes, and mouse dragging. Autoplay uses a 12-second interval and pauses during interaction or when the page is hidden. Featured carousel transitions and autoplay remain enabled regardless of the OS animation setting.
- Mobile work/project cards fit their content and support 12-second autoplay, arrows, and swipes. Credentials and activities use a shared mobile group selector.
- Sticky return navigation and responsive section rails. Desktop journey years stay grouped in sticky buttons, alongside the vertical year rail on wide screens. The mobile journey heading stays above its sticky year selector. Section rails shrink at laptop widths and hide at viewport widths of 1200px or below.
- Responsive WebP images, lazy-loaded project/gallery images, static PDF thumbnails, and secondary pages loaded on demand.

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

For individual checks:

```sh
npm run type-check
npm run media
```

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
