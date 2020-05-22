import Cue from "./Cue";
import BeatGridMarker from "./BeatGridMarker";

export default interface SeratoTrackInfo {
  cues?: Cue[]
  bpmLock?: boolean
  color?: string
  beatgridMarkers?: BeatGridMarker[]
}
