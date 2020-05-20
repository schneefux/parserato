import * as taglib from "taglib3"
import * as path from "path"
import { promisify } from "util"
import FrameMap from "./serato/FrameMap"
import TagMap from "./TaglibTagMap"
import { decode, encode } from "./serato/index"
import TaglibAudioProperties from "./TaglibAudioProperties"
import { deserialize, serialize } from "./taglib/index"
import TaglibId3Map from "./TaglibId3Map"
import TrackInfo from "./TrackInfo"
import SeratoTrackInfo from "./serato/SeratoTrackInfo"

const readId3Tags = promisify(taglib.readId3Tags)
const readTaglibTags = promisify(taglib.readTags)
const readAudioProperties = promisify(taglib.readAudioProperties)
const writeId3Tags = promisify(taglib.writeId3Tags)
const writeTaglibTags = promisify(taglib.writeTags)

/**
 * Load a track and all its attributes from the file system.
 *
 * @param trackPath
 * @returns track information
 */
export async function read(trackPath: string): Promise<TrackInfo> {
  const seratoData = await readSeratoData(trackPath)
  const tags = await readTaglibTags(trackPath) as TagMap
  const audioProperties = await readAudioProperties(trackPath) as TaglibAudioProperties
  const taglibData = deserialize(tags)

  return {
    path: trackPath,
    filename: path.basename(trackPath),
    durationSeconds: parseInt(audioProperties.length),
    ...seratoData,
    ...taglibData,
  }
}

/**
 * Read an audio file's Serato track info.
 *
 * @param path
 * @returns Serato track information
 */
export async function readSeratoData(path: string) {
  let frames: FrameMap

  if (path.endsWith('.mp3')) {
    // use taglib ID3 interface which will read GEOB tags
    const info = await readId3Tags(path) as TaglibId3Map
    frames = [...Object.entries(info)]
      .filter(([name, value]) => name.toLowerCase().startsWith('serato'))
      .reduce((obj, [name, value]) => ({ ...obj, [name]: Buffer.from(value, 'base64') }), {})
  } else {
    // use generic taglib interface
    const mimetype = Buffer.from('application/octet-stream').toString('base64')
    const info = await readTaglibTags(path) as TagMap
    frames = [...Object.entries(info)]
      .filter(([name, value]) => name.startsWith('SERATO_') && value.length == 1 && value[0].startsWith(mimetype))
      .reduce((obj, [name, value]) => ({ ...obj, [name]: Buffer.from(value[0], 'base64') }), {})
  }

  return decode(frames)
}

/**
 * Write Serato and ID3 tags.
 *
 * @param trackInfo
 */
export async function write(trackInfo: TrackInfo) {
  if (trackInfo.path === undefined) {
    throw new Error('track info path is undefined')
  }

  const taglibTags = serialize(trackInfo)
  await writeTaglibTags(trackInfo.path, taglibTags)
  await writeSeratoData(trackInfo.path, trackInfo)
}

/**
 * Write Serato track information to an audio file.
 *
 * @param trackPath file path
 * @param trackInfo track information
 */
export async function writeSeratoData(trackPath: string, trackInfo: SeratoTrackInfo) {
  const tags = encode(trackInfo)

  if (trackPath.endsWith('.mp3')) {
    await writeId3Tags(trackPath, {
      'Serato Markers2': tags['Serato Markers2'].toString('base64'),
      // 'Serato Markers_' duplicates first 5 cues
      // and gets precedence over Serato Markers2 -> delete it
      'Serato Markers_': '',
    })
  } else {
    // VORBIS COMMENT has newlines every 72 characters
    await writeTaglibTags(trackPath, {
      SERATO_MARKERS_V2: [tags['Serato Markers2'].toString('base64')
        .replace(/(.{72})/g, '$1\n')],
    })
  }
}