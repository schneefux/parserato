import SeratoMarker from "./SeratoMarker"

/**
 * Implements a marker that describes a track's color.
 */
export default class SeratoColorMarker implements SeratoMarker {
  id = 'COLOR'
  size = 4
  color: string = '#ffffff'

  decode(buf: Buffer) {
    // \x00
    this.color = '#' + buf.slice(1, 4).toString('hex')
  }

  encode(): Buffer {
    const buf = Buffer.alloc(this.size)
    Buffer.from(this.color.slice(1), 'hex').copy(buf, 1)
    return buf
  }
}
