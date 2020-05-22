#!/usr/bin/env node
import yargs = require('yargs')
import { listRoots, listCrates, listSongs } from './crate'
import { read, readSeratoData } from './track'
import * as taglib from 'taglib3'

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
      yargs.positional('mountpoint', {
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
      yargs.positional('crate', {
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
      yargs.positional('song', {
        describe: 'song to read',
        type: 'string',
      })
      yargs.option('raw', {
        alias: 'r',
        type: 'boolean',
        default: false,
        description: 'Output tags unparsed',
      })
    },
    async (argv) => {
      const song = argv.song as string
      if (argv.raw) {
        let tags = taglib.readTagsSync(song)
        if (song.endsWith('.mp3')) {
          tags = { ...tags, ...taglib.readId3TagsSync(song) }
        }
        log(tags)
      } else {
        log(await read(song))
      }
    }
  )
  .demandCommand()
  .argv