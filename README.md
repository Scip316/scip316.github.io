# Darrel Lim — Portfolio

Personal portfolio built with Vue 3, TypeScript, and Vite. It includes work experience, projects, credentials, and achievements, with content maintained through JSON files in `src/data/`.

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

The production files are generated in `dist/`.

## Content and media

- Update portfolio content in `src/data/`.
- Store public images, PDFs, and other media in `public/`.
- Reference public media with root-relative paths, for example: `/projects/Lunch_Box.jpg`.
- `npm run dev` and `npm run build` automatically generate responsive WebP images and first-page PDF thumbnails. Originals and PDF download links are preserved.
- After changing media while the development server is already running, run `npm run media` (or restart it). Content hashes refresh generated URLs when source files change.
- Generated files live in `public/generated-media/`, with their mapping in `src/data/media-assets.json`; do not edit these manually. PDF.js and canvas are used during generation, not in the visitor's browser.

## Docker

```sh
docker build -t darrel-portfolio .
docker run --rm -p 8080:80 darrel-portfolio
```

The Nginx configuration supports direct visits to portfolio routes such as `/projects`, `/experience`, and `/certificates`.
