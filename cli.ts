#!/usr/bin/env node
import yargs = require('yargs')
import { listRoots, listCrates, listSongs } from './crate'
import { read } from './track'

function log(data: any) {
  console.log(JSON.stringify(data, null, 2))
}

yargs
  .scriptName('parserato')
  .command('drives',
    'list mountpoints',
    () => {},
    async () => log(await listRoots())
  )
  .command('crates <mountpoint>',
    'list crates on drive',
    (yargs) => {
      yargs.positional('path', {
        describe: 'drive mountpoint to search',
        type: 'string',
      })
    },
    async (argv) => {
      log(await listCrates(argv.mountpoint as string))
    }
  )
  .command('songs <crate>',
    'list songs in crate',
    (yargs) => {
      yargs.positional('path', {
        describe: 'crate to read',
        type: 'string',
      })
    },
    async (argv) => {
      log(await listSongs(argv.crate as string))
    }
  )
  .command('tags <song>',
    'list tags for song',
    (yargs) => {
      yargs.positional('path', {
        describe: 'song to read',
        type: 'string',
      })
    },
    async (argv) => {
      log(await read(argv.song as string))
    }
  )
  .demandCommand()
  .argv