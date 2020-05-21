import { exec } from "pkg"
import archiver from "archiver"
import * as fs from "fs"

/**
 * Build a zip that contains standalone CLI binaries.
 */
async function createPackage() {
  const out = 'parserato-cli/'

  // package
  await exec(['--target', 'host', '--output', out + 'parserato', 'package.json'])

  // copy native modules
  await fs.promises.copyFile('node_modules/taglib3/build/Release/taglib3.node', out + 'taglib3.node')
  await fs.promises.copyFile('node_modules/drivelist/build/Release/drivelist.node', out + 'drivelist.node')

  // zip
  const archive = archiver('zip', { zlib: { level: 7 }})
  const stream = fs.createWriteStream(`parserato-${process.platform}-${process.arch}.zip`)

  await new Promise((resolve, reject) => {
    archive
      .directory(out, 'parserato')
      .on('error', err => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })
}

createPackage().catch(console.error)