import SeratoMarkers2Frame from "./frame/SeratoMarkers2Frame"
import SeratoCueMarker from "./frame/marker2/SeratoCueMarker"
import SeratoBpmLockMarker from "./frame/marker2/SeratoBpmLockMarker"
import SeratoColorMarker from "./frame/marker2/SeratoColorMarker"
import { decode as decodeFrame, encode as encodeFrame } from "./frame/index"
import FrameMap from "./FrameMap"
import SeratoTrackInfo from "./SeratoTrackInfo"
import SeratoBeatGridFrame from "./frame/SeratoBeatGridFrame"
import SeratoNonTerminalBeatGridMarker from "./frame/beatgrid/SeratoNonTerminalBeatGridMarker"
import SeratoTerminalBeatGridMarker from "./frame/beatgrid/SeratoTerminalBeatGridMarker"

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
    .filter(f => f instanceof SeratoMarkers2Frame)[0] as SeratoMarkers2Frame|null

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

  const beatgrid = frames
    .filter(f => f instanceof SeratoBeatGridFrame)[0] as SeratoBeatGridFrame|null

  if (beatgrid) {
    trackInfo.beatgridMarkers = []
    for (let n = 0; n < beatgrid.data.length - 1; n++) {
      const nonTerminal = beatgrid.data[n] as SeratoNonTerminalBeatGridMarker
      const next = beatgrid.data[n+1]
      const bpm = nonTerminal.beatsTillNext / ((next.position - nonTerminal.position) / 60)
      trackInfo.beatgridMarkers.push({
        position: nonTerminal.position,
        bpm,
      })
    }
    trackInfo.beatgridMarkers.push(beatgrid.data[beatgrid.data.length - 1] as SeratoTerminalBeatGridMarker)
  }

  return trackInfo
}

/**
 * Encode track information to GEOB Frame buffers.
 *
 * Return 'Serato Marker2' if any of color,
 *   cues or bpmLock are given.
 *   Defaults will be used for those that are not.
 * Return 'Serato BeatGrid' if beatgridMarkers are given.
 *
 * @param trackInfo data
 * @returns GEOB Frames
 */
export function encode(trackInfo: SeratoTrackInfo) {
  // TODO: Do not blindly override - merge 'Serato Marker2' data
  const frameMap = {} as FrameMap

  if (trackInfo.color !== undefined
   || trackInfo.cues !== undefined
   || trackInfo.bpmLock !== undefined) {
    const markers2 = new SeratoMarkers2Frame()

    const colorMarker = Object.assign(new SeratoColorMarker(), {
      color: trackInfo.color || '#ffffff',
    })
    markers2.data.push(colorMarker)

    trackInfo.cues?.forEach((cue, index) => {
      const cueMarker = Object.assign(new SeratoCueMarker(), {
        index: cue.index || index,
        milliseconds: cue.milliseconds || 0,
        color: cue.color || '#ff0000',
        name: cue.name || '',
      })

      markers2.data.push(cueMarker)
    })

    const bpmLockMarker = Object.assign(new SeratoBpmLockMarker(), {
      isActive: trackInfo.bpmLock || false,
    })
    markers2.data.push(bpmLockMarker)

    frameMap[markers2.id] = encodeFrame(markers2)
  }

  if (trackInfo.beatgridMarkers !== undefined) {
    const beatgrid = new SeratoBeatGridFrame()

    for (let n = 0; n < trackInfo.beatgridMarkers.length - 1; n++) {
      const marker = new SeratoNonTerminalBeatGridMarker()
      const thisMarker = trackInfo.beatgridMarkers[n]
      const nextMarker = trackInfo.beatgridMarkers[n + 1]
      marker.beatsTillNext = Math.floor(thisMarker.bpm * (nextMarker.position - thisMarker.position) / 60)
      marker.position = thisMarker.position
      beatgrid.data.push(marker)
    }

    const marker = new SeratoTerminalBeatGridMarker()
    const thisMarker = trackInfo.beatgridMarkers[trackInfo.beatgridMarkers.length - 1]
    marker.position = thisMarker.position
    marker.bpm = thisMarker.bpm
    beatgrid.data.push(marker)

    frameMap[beatgrid.id] = encodeFrame(beatgrid)
  }

  return frameMap
}