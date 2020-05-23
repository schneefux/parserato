#!/usr/bin/env node
import yargs = require('yargs')
import * as path from 'path'
import * as taglib from 'taglib3'
import { listRoots, listCrates, listSongs } from './crate'
import { read, write } from './track'
import TrackInfo from './track/TrackInfo'

function log(data: any) {
  console.log(JSON.stringify(data, null, 2))
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin
    let data = ''

    stdin.setEncoding('utf8')
    stdin.on('data', (chunk) => data += chunk)
    stdin.on('end', () => resolve(data))
    stdin.on('error', reject)
  });
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
  .command('tags <track>',
    'list or modify tags for a track',
    (yargs) => {
      yargs.positional('track', {
        describe: 'track to read or write',
        type: 'string',
      })
      yargs.option('raw', {
        alias: 'r',
        type: 'boolean',
        default: false,
        description: 'Output tags without parsing Serato GEOB',
      })
      yargs.option('data', {
        alias: 'd',
        type: 'string',
        description: 'JSON for updating tags, use - to read from stdin',
      })
    },
    async (argv) => {
      const track = argv.track as string
      if (argv.raw && argv.data) {
        console.error('CLI does not support writing raw tags at the moment')
        return
      }

      if (argv.data) {
        const data = argv.data == '-' ? await readStdin() : argv.data as string
        const tags = JSON.parse(data) as TrackInfo

        await write({
          ...tags,
          path: track,
          filename: path.basename(track),
        })
      }

      if (argv.raw) {
        let tags = taglib.readTagsSync(track)
        if (track.endsWith('.mp3')) {
          tags = { ...tags, ...taglib.readId3TagsSync(track) }
        }
        log(tags)
      } else {
        log(await read(track))
      }
    }
  )
  .demandCommand()
  .argv