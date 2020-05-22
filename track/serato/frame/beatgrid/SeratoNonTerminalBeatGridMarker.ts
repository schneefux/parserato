import SeratoBeatGridMarker from "./SeratoBeatGridMarker"

/**
 * Implements a non-terminal BeatGrid marker.
 */
export default class SeratoNonTerminalBeatGridMarker implements SeratoBeatGridMarker {
  position: number = 0
  beatsTillNext: number = 0

  decode(buf: Buffer) {
    this.position = buf.readFloatBE(0)
    this.beatsTillNext = buf.readUInt32BE(4)
  }

  encode(): Buffer {
    const buf = Buffer.alloc(8)
    buf.writeFloatBE(this.position, 0)
    buf.writeUInt32BE(this.beatsTillNext, 4)
    return buf
  }
}
