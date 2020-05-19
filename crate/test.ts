import * as path from 'path'
import * as os from 'os'
import { listRoots, listCrates, listSongs } from './index'

const testData = 'test-data/'
const drivePath = path.resolve('/')

test('should list roots', async () => {
  const roots = await listRoots()
  expect(roots).toContain(path.join(os.homedir(), 'Music'))
})

test('should detect crates', async () => {
  const crates = await listCrates(testData)
  expect(crates.length).toBe(2)
})

test('should list songs in crate', async () => {
  const songs = await listSongs(path.join(testData, '_Serato_', 'Subcrates', 'test1.crate'))

  expect(songs.length).toBe(3)
  expect(songs).toMatchObject([
    path.join(drivePath, 'retro_funky.flac'),
    path.join(drivePath, 'retro_funky.mp3'),
    path.join(drivePath, 'retro_funky.ogg'),
  ])
})

test('should list songs in crate', async () => {
  const songs = await listSongs(path.join(testData, '_Serato_', 'Subcrates', 'test2.crate'))

  expect(songs.length).toBe(1)
  expect(songs).toMatchObject([
    path.join(drivePath, 'Users/schneefux/Downloads/Persephone - Retro Funky (SUNDANCE remix).mp3'),
  ])
})
