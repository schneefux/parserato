import Cue from "./Cue";

export default interface SeratoTrackInfo {
  cues?: Cue[]
  bpmLock?: boolean
  color?: string
}
