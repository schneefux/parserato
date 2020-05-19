#!/usr/bin/env node

import * as fs from 'fs'
import { listRoots, listCrates, listSongs } from './crate'
import { read } from './track'

function log(data: any) {
  console.log(JSON.stringify(data, null, 2))
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length == 0) {
    // list roots
    log(await listRoots())
    return
  }

  const givenPath = args[0]
  const stat = await fs.promises.lstat(givenPath)
  if (stat.isDirectory()) {
    // list crates
    log(await listCrates(givenPath))
    return
  }

  if (givenPath.endsWith('.crate')) {
    // list songs
    log(await listSongs(givenPath))
    return
  }

  log(await read(givenPath))
}

main().catch(console.error)