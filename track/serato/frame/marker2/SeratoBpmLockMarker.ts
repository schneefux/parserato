import SeratoMarker2 from "./SeratoMarker2"

/**
 * Implements a marker that stores whether the BPM Lock is set.
 *
 * If active, the user cannot modify BPM or Beatgrid.
 * Inactive by default.
 *
 * @see https://support.serato.com/hc/en-us/articles/235214887-Lock-Beatgrids
 */
export default class SeratoBpmLockMarker implements SeratoMarker2 {
  id = 'BPMLOCK'
  size = 1
  isActive: boolean = false

  decode(buf: Buffer) {
    this.isActive = buf.readUInt8(0) != 0
  }

  encode() {
    return Buffer.from(this.isActive ? '\x01' : '\x00')
  }
}
