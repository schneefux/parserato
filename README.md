Parserato
===

  * Find and read Serato crates (`crate/`)
  * Read and write Serato GEOB frames (`track/`)

Crates
---

```javascript
import { listRoots, listCrates, listSongs } from 'parserato/crate'

// get mountpoints which might contain a `_Serato_` subfolder
const drives = await listRoots()
// get crates in a folder
const crates = await listCrates(drives[0])
// get songs in a crate
await listSongs(crates[0])
```

Track Meta data
---

```javascript
import { read, write } from 'parserato/track'

const track = await read('retro_funky.mp3')
console.log(track.cues)
// [{ index: 0, color: '#cc0000', milliseconds: 27885, name: 'start of track ♥' }, ...]

track.cues = []
await write(track)
```

The parser needs to run through multiple stages of de-/encoding:
  * ID3 tags or VORBIS COMMENTs are read from the audio file (`track/`)
  * Any GEOB frames found are parsed (`frame/`)
  * A `Serato Markers2` frame contains multiple markers (`frame/marker/`), each of them has a body which is parsed

Command Line Interface
---

  * `parserato`: List mountpoints
  * `parserato /m`: List crates in mountpoint
  * `parserato /m/_Serato_/Subcrates/test1.crate`: List songs in crate
  * `parserato /m/music/retro_funky.flac`: Read track information
