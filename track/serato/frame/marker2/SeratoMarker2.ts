/**
 * Generic Serato Marker 2 interface.
 */
export default interface SeratoMarker2 {
  id: string
  size: number

  encode(): Buffer
  decode(buf: Buffer): void
}
