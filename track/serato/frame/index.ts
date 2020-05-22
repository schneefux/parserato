import SeratoMarkers2Frame from "./SeratoMarkers2Frame"
import Frame from "./Frame"
import SeratoBeatGridFrame from "./SeratoBeatGridFrame"

/**
 * Inspect frame's meta data.
 *
 * @param buf GEOB Buffer
 * @returns generic Frame
 */
export function read(buf: Buffer): Frame<Buffer> {
  let rest = buf
  const mimetype = rest.slice(0, rest.indexOf('\x00')).toString()
  rest = rest.slice(mimetype.length + 1)
  const filename = rest.slice(0, rest.indexOf('\x00')).toString()
  rest = rest.slice(filename.length + 1)
  const id = rest.slice(0, rest.indexOf('\x00')).toString()
  rest = rest.slice(id.length + 1)
  const data = rest

  return { mimetype, filename, id, data } as Frame<Buffer>
}

/**
 * Decode a Serato frame.
 *
 * @param buf GEOB Buffer
 * @returns Serato Frame or null if the frame is unsupported.
 */
export function decode(buf: Buffer): SeratoMarkers2Frame|SeratoBeatGridFrame|null {
  const frame = read(buf)
  if (frame.id == 'Serato Markers2') {
    const markers2 = new SeratoMarkers2Frame()
    markers2.decode(frame.data)
    return markers2
  }

  if (frame.id == 'Serato BeatGrid') {
    const beatgrid = new SeratoBeatGridFrame()
    beatgrid.decode(frame.data)
    return beatgrid
  }

  return null
}

/**
 * Encode a Serato frame.
 *
 * @param frame Frame
 * @returns GEOB Buffer
 */
export function encode<T>(frame: Frame<T>): Buffer {
  const buf = Buffer.alloc(
    frame.mimetype.length + 1 + frame.filename.length + 1
    + frame.id.length + 1 + frame.size)
  let cursor = 0
  buf.write(frame.mimetype + '\x00', cursor)
  cursor += frame.mimetype.length + 1
  buf.write(frame.filename + '\x00', cursor)
  cursor += frame.filename.length + 1
  buf.write(frame.id + '\x00', cursor)
  cursor += frame.id.length + 1
  frame.encode().copy(buf, cursor)
  return buf
}