import mediaAssets from '../data/media-assets.json'

type MediaAsset = { small: string; large: string; smallWidth: number; largeWidth: number }
const assets: Record<string, MediaAsset> = mediaAssets

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
