import SeratoMarker from "./SeratoMarker"
import SeratoCueMarker from "./SeratoCueMarker"
import SeratoBpmLockMarker from "./SeratoBpmLockMarker"
import SeratoColorMarker from "./SeratoColorMarker"

/**
 * Decode a Serato Marker v2.
 *
 * @param id Serato Marker ID
 * @param payload Serato Marker payload
 * @returns parsed marker or null if the marker is unsupported.
 */
export function decode(id: string, payload: Buffer): SeratoMarker|null {
  let marker: SeratoMarker

  switch (id) {
    case 'CUE':
      marker = new SeratoCueMarker()
      marker.decode(payload)
      return marker
    case 'BPMLOCK':
      marker = new SeratoBpmLockMarker()
      marker.decode(payload)
      return marker
    case 'COLOR':
      marker = new SeratoColorMarker()
      marker.decode(payload)
      return marker
  }

  return null
}
