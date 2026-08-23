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

## Docker

```sh
docker build -t darrel-portfolio .
docker run --rm -p 8080:80 darrel-portfolio
```

The Nginx configuration supports direct visits to portfolio routes such as `/projects`, `/experience`, and `/certificates`.
