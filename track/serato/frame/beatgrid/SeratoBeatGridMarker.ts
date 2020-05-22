/**
 * Generic Serato BeatGrid marker interface.
 */
export default interface SeratoBeatGridMarker {
  position: number

  encode(): Buffer
  decode(buf: Buffer): void
}
