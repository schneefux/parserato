import SeratoMarkers2Frame from "./frame/SeratoMarkers2Frame"
import SeratoCueMarker from "./frame/marker/SeratoCueMarker"
import SeratoBpmLockMarker from "./frame/marker/SeratoBpmLockMarker"
import SeratoColorMarker from "./frame/marker/SeratoColorMarker"
import { decode as decodeFrame, encode as encodeFrame } from "./frame/index"
import FrameMap from "./FrameMap"
import SeratoTrackInfo from "./SeratoTrackInfo"

/**
 * Read track information from GEOB Frame buffers.
 *
 * @param buffers GEOB Frames
 * @returns parsed data
 */
export function decode(tags: FrameMap) {
  const trackInfo = {} as SeratoTrackInfo

  const frames = [...Object.values(tags)]
    .map(buf => decodeFrame(buf))
    .filter(frame => frame !== null)

  const markers2 = frames
    .filter(f => f instanceof SeratoMarkers2Frame)[0]

  if (markers2) {
    trackInfo.cues = markers2.data
      .filter(d => d instanceof SeratoCueMarker)
      .map(marker => marker as SeratoCueMarker)
      .map(cueMarker => ({
        index: cueMarker.index,
        color: cueMarker.color,
        milliseconds: cueMarker.milliseconds,
        name: cueMarker.name,
      }))

    const bpmLock = markers2.data
      .filter(d => d instanceof SeratoBpmLockMarker)[0] as SeratoBpmLockMarker
    if (bpmLock) {
      trackInfo.bpmLock = bpmLock.isActive
    }

    const color = markers2.data
      .filter(d => d instanceof SeratoColorMarker)[0] as SeratoColorMarker
    if (color) {
      trackInfo.color = color.color
    }
  }

  return trackInfo
}

/**
 * Encode track information to GEOB Frame buffers.
 *
 * @param trackInfo data
 * @returns GEOB Frames
 */
export function encode(trackInfo: SeratoTrackInfo) {
  const markers2 = new SeratoMarkers2Frame()

  if (trackInfo.color !== undefined) {
    const colorMarker = Object.assign(new SeratoColorMarker(), {
      color: trackInfo.color,
    })

    markers2.data.push(colorMarker)
  }

  trackInfo.cues?.forEach((cue, index) => {
    const cueMarker = Object.assign(new SeratoCueMarker(), {
      index: cue.index || index,
      milliseconds: cue.milliseconds,
      color: cue.color || '#ff0000',
      name: cue.name || '',
    })

    markers2.data.push(cueMarker)
  })

  if (trackInfo.bpmLock !== undefined) {
    const bpmLockMarker = Object.assign(new SeratoBpmLockMarker(), {
      isActive: trackInfo.bpmLock,
    })

    markers2.data.push(bpmLockMarker)
  }

  return {
    [markers2.id]: encodeFrame(markers2),
  } as FrameMap
}