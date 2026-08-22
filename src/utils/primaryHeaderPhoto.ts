export const primaryHeaderPhoto = (headerPhoto: string | string[]) =>
  Array.isArray(headerPhoto) ? (headerPhoto[0] ?? '') : headerPhoto
