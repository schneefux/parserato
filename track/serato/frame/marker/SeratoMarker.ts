/**
 * Generic Serato Marker interface.
 */
export default interface SeratoMarker {
  id: string
  size: number

  encode(): Buffer
  decode(buf: Buffer): void
}
