import * as fs from 'fs'
import * as path from 'path'
import * as globCb from 'glob'
import * as drivelist from 'drivelist'
import * as os from 'os'
import { promisify } from 'util'

const glob = promisify(globCb.default as any)

// based on https://github.com/MartinHH/CrateToM3U/blob/master/src/main/scala/io/github/martinhh/sl/CrateExtractor.scala

/**
 * @returns folders which might contain crates.
 */
export async function listRoots(){
  const drives = await drivelist.list()
  const mounts = ([] as drivelist.Mountpoint[])
    .concat(...drives.map(d => d.mountpoints))
  return mounts.map(m => m.path)
    .concat(path.join(os.homedir(), 'Music')) as string[]
}

/**
 * @param root folder to search.
 * @returns crate paths.
 */
export async function listCrates(root: string) {
  const crates = await glob('_Serato_/Subcrates/*.crate', {
    cwd: root,
    silent: true,
    strict: false,
  })
  return crates.map(c => path.join(root, c)) as string[]
}

/**
 * @param cratePath
 * @returns songs in that crate.
 */
export async function listSongs(cratePath: string) {
  const ptrk = Buffer.from('ptrk')

  let buf = await fs.promises.readFile(cratePath)
  let paths = [] as string[]

  while (true) {
    // 'ptrk'
    const start = buf.indexOf(ptrk)

    if (start == -1) {
      break
    }

    // 4 byte length
    buf = buf.slice(start + ptrk.length)
    const len = buf.readUInt32BE(0)
    buf = buf.slice(4)

    // utf16 BE file name
    const song = buf.slice(0, len)
      .swap16()
      .toString('utf16le')
    // go from crate path to root, then append song
    paths.push(path.resolve(cratePath, '/', song))

    buf = buf.slice(len)
  }

  return paths
}
