import SeratoTrackInfo from "./serato/SeratoTrackInfo";
import TaglibTrackInfo from "./taglib/TaglibTrackInfo";

export default interface TrackInfo extends SeratoTrackInfo, TaglibTrackInfo {
  path: string
  filename?: string
  durationSeconds?: number
}