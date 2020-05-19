/**
 * Implements a GEOB frame.
 *
 * @see https://id3.org/id3v2.4.0-frames Section 4.15.
 */
export default interface Frame<T> {
  //encoding: number
  // 1 byte, handled by taglib
  mimetype: string // terminated by \x00
  filename: string // terminated by \x00
  id: string // terminated by \x00
  size: number
  data: T

  encode(): Buffer
  decode(buf: Buffer): void
}
