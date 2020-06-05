Parserato
===

[![Build Status](https://travis-ci.com/schneefux/parserato.svg?token=7Xr5KgmaaKq86Bsihnpx&branch=master)](https://travis-ci.com/schneefux/parserato)

Serato data interface for NodeJS.

Find and read Serato crates, read and write cues Serato GEOB frames.

If you want to use this library in a commercial application, contact me by mail.

Installation
---

Create an `.npmrc` in your project's root directory. Add the following line so that packages with the `@schneefux` scope will be installed from the GitHub packages repository: `@schneefux:registry=https://npm.pkg.github.com`

You might need to log in to GitHub via npm once. See [GitHub's documentation](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#installing-a-package) for details.

Parserato depends on [node-taglib3](https://github.com/schneefux/node-taglib3), a native Node module which provides bindings for the taglib C library. See the installation section [in the node-taglib3 README](https://github.com/schneefux/node-taglib3#installation) for links to the required toolchains.

Command Line Interface
---

For debugging and non NodeJS applications, a CLI application can be used which prints JSON data to the console.

  * `parserato drives`: list mountpoints
  * `parserato crates /m`: list crates in mountpoint
  * `parserato songs /m/_Serato_/Subcrates/test1.crate`: list songs in crate
  * `parserato tags /m/music/retro_funky.flac`: list tags for song

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

Track Data
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
  * Any GEOB frames found are parsed (`track/serato/frame/`)
  * A `Serato Markers2` frame contains multiple markers (`track/serato/frame/marker/`), each of them has a body which is parsed

### Deployment Notes

  * The package is built and published using Travis CI
  * To release, update the version in `package.json`, commit, tag and push