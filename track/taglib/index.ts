import TaglibTrackInfo from "./TaglibTrackInfo"
import TaglibMap from "./TaglibMap"

/**
 * Read tags from TagLib map
 * into type-safe track information object.
 *
 * @param tags
 * @returns track information
 */
export function deserialize(tags: TaglibMap) {
  const trackInfo = {} as TaglibTrackInfo
  trackInfo.album = tags.ALBUM?.[0]
  trackInfo.title = tags.TITLE?.[0]
  trackInfo.artists = tags.ARTIST?.[0]?.split(',').map(s => s.trim())
  trackInfo.bpm = parseInt(tags.BPM?.[0]) || undefined
  trackInfo.genre = tags.GENRE?.[0]
  trackInfo.key = tags.INITIALKEY?.[0]
  trackInfo.isrc = tags.ISRC?.[0]
  return trackInfo
}

/**
 * Write track information into TagLib map.
 *
 * @param trackInfo
 * @returns TagLib map
 */
export function serialize(trackInfo: TaglibTrackInfo) {
  const tags = {} as TaglibMap
  if (trackInfo.album) {
    tags.ALBUM = [trackInfo.album]
  }
  if (trackInfo.title) {
    tags.TITLE = [trackInfo.title]
  }
  if (trackInfo.artists) {
    tags.ARTIST = [trackInfo.artists.join(', ')]
  }
  if (trackInfo.bpm) {
    tags.BPM = [trackInfo.bpm.toString()]
  }
  if (trackInfo.genre) {
    tags.GENRE = [trackInfo.genre]
  }
  if (trackInfo.key) {
    tags.INITIALKEY = [trackInfo.key]
  }
  if (trackInfo.isrc) {
    tags.ISRC = [trackInfo.isrc]
  }

  return tags
}