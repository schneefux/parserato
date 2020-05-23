import Frame from "./Frame"
import SeratoNonTerminalBeatGridMarker from "./beatgrid/SeratoNonTerminalBeatGridMarker"
import SeratoBeatGridMarker from "./beatgrid/SeratoBeatGridMarker"
import SeratoTerminalBeatGridMarker from "./beatgrid/SeratoTerminalBeatGridMarker"

/**
 * Implements a 'Serato BeatGrid' frame,
 * which contains markers with information about BPM.
 *
 * @see https://github.com/Holzhaus/serato-tags/blob/master/docs/serato_beatgrid.md
 */
export default class SeratoBeatGridFrame implements Frame<SeratoBeatGridMarker[]> {
  encoding = 0
  mimetype = 'application/octet-stream'
  filename = ''
  id = 'Serato BeatGrid'
  versionMajor: number = 1
  versionMinor: number = 0
  data: SeratoBeatGridMarker[] = []

  get size() {
    // header + markers + footer
    return 6 + this.data.length * 8 + 1
  }

  decode(buf: Buffer) {
    if (buf.length == 0) {
      return
    }

    // version
    this.versionMajor = buf.readInt8(0)
    buf = buf.slice(1)
    this.versionMinor = buf.readInt8(0)
    buf = buf.slice(1)

    this.data = []

    const numberOfMarkers = buf.readUInt32BE(0)
    buf = buf.slice(4)

    for (let n = 0; n < numberOfMarkers - 1; n++) {
      const marker = new SeratoNonTerminalBeatGridMarker()
      marker.decode(buf)
      this.data.push(marker)
      buf = buf.slice(8)
    }

    const marker = new SeratoTerminalBeatGridMarker()
    marker.decode(buf)
    this.data.push(marker)
    buf = buf.slice(8)

    // x00
    buf = buf.slice(1)
  }

  encode(): Buffer {
    if (this.data.length == 0) {
      throw new Error('BeatGrid must contain at least 1 marker')
    }

    const buf = Buffer.alloc(this.size)
    buf.writeInt8(this.versionMajor, 0)
    buf.writeInt8(this.versionMinor, 1)
    buf.writeUInt32BE(this.data.length, 2)
    let cursor = 6
    for (const marker of this.data) {
      marker.encode().copy(buf, cursor)
      cursor += 8
    }
    // x00
    return buf
  }
}
