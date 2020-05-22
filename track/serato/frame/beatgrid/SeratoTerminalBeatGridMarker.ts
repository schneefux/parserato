import SeratoBeatGridMarker from "./SeratoBeatGridMarker"

/**
 * Implements a terminal BeatGrid marker.
 */
export default class SeratoTerminalBeatGridMarker implements SeratoBeatGridMarker {
  position: number = 0
  bpm: number = 0

  decode(buf: Buffer) {
    this.position = buf.readFloatBE(0)
    this.bpm = buf.readFloatBE(4)
  }

  encode(): Buffer {
    const buf = Buffer.alloc(8)
    buf.writeFloatBE(this.position, 0)
    buf.writeFloatBE(this.bpm, 4)
    return buf
  }
}
