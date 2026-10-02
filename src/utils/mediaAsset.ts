import mediaAssets from '../data/media-assets.json'

type MediaAsset = {
  small: string
  large: string
  smallWidth: number
  largeWidth: number
  preview?: string
}
const assets: Record<string, MediaAsset> = mediaAssets
export const mediaPreview = (source: string) => assets[source]?.preview
export const mediaPreviewStyle = (source: string) => {
  const preview = mediaPreview(source)
  return preview
    ? {
        backgroundImage: `url('${preview}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }
    : undefined
}

export const mediaSrc = (source: string) => {
  const asset = assets[source]
  if (source.toLowerCase().endsWith('.pdf') && !asset) {
    throw new Error(`Missing PDF thumbnail: ${source}. Run npm run media.`)
  }
  return asset?.large ?? source
}
export const mediaSrcset = (source: string) => {
  const asset = assets[source]
  if (!asset || asset.smallWidth === asset.largeWidth) return undefined
  return `${asset.small} ${asset.smallWidth}w, ${asset.large} ${asset.largeWidth}w`
}
