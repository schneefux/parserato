import Frame from "./Frame"
import SeratoMarker from "./marker2/SeratoMarker2"
import { decode as decodeMarker } from "./marker2"

/**
 * Implements a 'Serato Markers2' frame,
 * which contains markers with information about BPM lock,
 * track color, cues, loops and flips.
 *
 * @see https://github.com/Holzhaus/serato-tags/blob/master/docs/serato_markers2.md
 */
export default class SeratoMarkers2Frame implements Frame<SeratoMarker[]> {
  encoding = 0
  mimetype = 'application/octet-stream'
  filename = ''
  id = 'Serato Markers2'
  size = 512 - 41 // 41 for GEOB header
  versionMajor: number = 1
  versionMinor: number = 1
  data: SeratoMarker[] = []

  decode(data: Buffer) {
    if (data.length == 0) {
      return
    }

    // version
    this.versionMajor = data.readInt8(0)
    this.versionMinor = data.readInt8(1)

    // content
    // there is a line break every 72 chars for VORBIS COMMENT, but the JS parser ignores it
    let buf = Buffer.from(data.slice(2).toString(), 'base64')

    this.data = []
    // entries
    buf = buf.slice(2) // starts with \x01\x01
    do {
      // name + \x00
      const id = buf.slice(0, buf.indexOf('\x00')).toString()
      buf = buf.slice(id.length + 1)

      // size
      const size = buf.readUInt32BE(0)
      buf = buf.slice(4)

      // payload
      let payload = buf.slice(0, size)

      const marker = decodeMarker(id, payload)
      if (marker !== null) {
        this.data.push(marker)
      }

      buf = buf.slice(size);
    } while (buf.length && buf.slice(0, 1).toString() != '\x00')
  }

  encode(): Buffer {
    const bufSize = 2 + this.data
      .map(marker => marker.id.length + 1 + 4 + marker.size)
      .reduce((sum, s) => sum + s, 0) + 1
    const buf = Buffer.alloc(bufSize)
    // starts with \x0101
    buf.writeUInt8(1, 0)
    buf.writeUInt8(1, 1)
    let cursor = 2
    for (const marker of this.data) {
      buf.write(marker.id + '\x00', cursor)
      cursor += marker.id.length + 1
      buf.writeUInt32BE(marker.size, cursor)
      cursor += 4
      marker.encode().copy(buf, cursor)
      cursor += marker.size
    }
    // ends with \x00
    const base = buf.toString('base64')
    // NL every 72 chars
    const content = base.replace(/(.{72})/g, '$1\n')

    let size = 0
    size += 2 // version
    size += content.length
    const wrapper = Buffer.alloc(size)
    wrapper.writeUInt8(this.versionMajor, 0)
    wrapper.writeUInt8(this.versionMinor, 1)
    wrapper.write(content, 2)
    return wrapper
  }
}
