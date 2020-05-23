import * as taglib from 'taglib3'
import * as path from 'path'
import { copyFile as copyFileCb } from "fs";
import { promisify } from "util";
import { readSeratoData, read, write, writeSeratoData } from './index';

const copyFile = promisify(copyFileCb)
const testData = 'test-data/'

test('should read Serato data from mp3', async () => {
  const trackInfo = await readSeratoData(path.join(testData, 'retro_funky.mp3'))

  expect(trackInfo).toMatchObject({
    cues: [
      { color: "#cc0000", index: 0, milliseconds: 27885, name: 'start of track ♥' },
      { color: "#0000cc", index: 2, milliseconds: 88821 },
      { color: "#cccc00", index: 3, milliseconds: 162839 },
    ]
  })
})

test('should read Serato data from flac', async () => {
  const trackInfo = await readSeratoData(path.join(testData, 'retro_funky.flac'))

  expect(trackInfo).toMatchObject({
    cues: [
      { color: "#cc8800", index: 1, milliseconds: 23060 },
      { color: "#cc00cc", index: 5, milliseconds: 94993 },
      { color: "#8800cc", index: 7, milliseconds: 121151 },
    ]
  })
})

test('should write Serato data to flac', async () => {
  await copyFile(path.join(testData, 'retro_funky.flac'), path.join(testData, 'tmp', 'retro_funky.flac'))

  await writeSeratoData(path.join(testData, 'tmp', 'retro_funky.flac'), {
    cues: [
      { color: "#cc8800", index: 5, milliseconds: 23060, name: 'start of track ♥' },
      { color: "#cc00cc", index: 6, milliseconds: 94993, name: '' },
      { color: "#8800cc", index: 7, milliseconds: 121151, name: '' },
    ]
  })

  const tags = await taglib.readTags(path.join(testData, 'tmp', 'retro_funky.flac'))
  expect(tags).toMatchObject({
    "SERATO_ANALYSIS": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgEC"],
    "SERATO_AUTOGAIN": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQEyMjkuNzcALTMu\n" + "MjQ1ADAuMDAwAA"],
    "SERATO_BEATGRID": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAACP0bwmwAA\n" + "AAQ/7I+DQ2XGVwA="],
    "SERATO_MARKERS_V2": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVDB4UFVn\n" +
      "QUFBQUFFQVAvLy8wTlZSUUFBQUFBZEFBVUFBRm9VQU15SUFBQnpkR0Z5ZENCdlppQjBjbUZq\n" +
      "YXlEaW1hVkQKVlVVQUFBQUFEUUFHQUFGekVRRE1BTXdBQUFCRFZVVUFBQUFBRFFBSEFBSFpQ\n" +
      "d0NJQU13QUFBQkNVRTFNVDBOTEFBQUFBQUVBCkFBPT0AAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n" +
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="],
    /* "SERATO_OVERVIEW": ["..."], */
    "SERATO_PLAYCOUNT": ["3"],
    "SERATO_RELVOL": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gUmVsVm9sQWQAAQEBAAAA"],
    "SERATO_VIDEO_ASSOC": ["YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gVmlkQXNzb2MAAQEBAAAA"],
  })

  const data = await readSeratoData(path.join(testData, 'tmp', 'retro_funky.flac'))
  expect(data).toBeDefined()
})

test('should write Serato data to mp3', async () => {
  await copyFile(path.join(testData, 'retro_funky.mp3'), path.join(testData, 'tmp', 'retro_funky.mp3'))

  await writeSeratoData(path.join(testData, 'tmp', 'retro_funky.mp3'), {
    cues: [
      { index: 4, color: '#00cc00', milliseconds: 112920, name: '' },
      { index: 5, color: '#cc00cc', milliseconds: 40279, name: '' },
      { index: 7, color: '#8800cc', milliseconds: 174199, name: '' }
    ]
  })

  const tags = await taglib.readId3Tags(path.join(testData, 'tmp', 'retro_funky.mp3'))
  expect(tags['Serato Markers_']).toBeUndefined()
  expect(tags).toMatchObject({
    "Serato Analysis": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgE=",
    "Serato Autotags": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQExNDkuNTcALTMuMjUxADAuMDAwAA==",
    "Serato BeatGrid": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAACP1PGUgAAAARAGTc+QxWTEgA=",
    "Serato Markers2": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVDB4UFVnQUFBQUFFQVAvLy8wTlZSUUFBQUFBTkFBUUFBYmtZQUFETUFBQUFBRU5WUlFBQUFBQU5BQVVBQUoxWEFNd0EKekFBQUFFTlZSUUFBQUFBTkFBY0FBcWgzQUlnQXpBQUFBRUpRVFV4UFEwc0FBQUFBQVFBQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    /* "Serato Offsets_": "...", */
    /* "Serato Overview": "...", */
  })

  const data = await readSeratoData(path.join(testData, 'tmp', 'retro_funky.mp3'))
  expect(data).toBeDefined()
})

test('should merge Serato Markers2 data', async () => {
  await copyFile(path.join(testData, 'retro_funky.mp3'), path.join(testData, 'tmp', 'retro_funky.mp3'))

  // file already has 3 cues
  await writeSeratoData(path.join(testData, 'tmp', 'retro_funky.mp3'), {
    color: '#ff0000',
  })

  const data = await readSeratoData(path.join(testData, 'tmp', 'retro_funky.mp3'))
  expect(data.color).toBe('#ff0000')
  expect(data.cues!.length).toBe(3)
})

test('should read track info from mp3', async () => {
  const trackInfo = await read(path.join(testData, 'retro_funky.mp3'))

  expect(trackInfo).toMatchObject({
    "album": "Retro Funky",
    "artists": ["Perséphone"],
    "bpm": 150,
    "genre": undefined,
    "isrc": "NLPM11407110",
    "key": "Em",
    "title": "Retro Funky (SUNDANCE Remix)",
    "durationSeconds": 213,
  })
})

test('should read track info from flac', async () => {
  const trackInfo = await read(path.join(testData, 'retro_funky.flac'))

  expect(trackInfo).toMatchObject({
    "album": "Retro Funky",
    "artists": ["Perséphone"],
    "bpm": 230,
    "genre": undefined,
    "isrc": "NLPM11407110",
    "key": "Em",
    "title": "Retro Funky (SUNDANCE Remix)",
    "durationSeconds": 213,
  })
})

test('should write track info to mp3', async () => {
  await copyFile(path.join(testData, 'retro_funky.mp3'), path.join(testData, 'tmp', 'retro_funky.mp3'))

  await write({
    path: path.join(testData, 'tmp', 'retro_funky.mp3'),
    filename: 'retro_funky.mp3',
    durationSeconds: 123,
    title: 'Testing 123',
  })

  const tags = await taglib.readTags(path.join(testData, 'tmp', 'retro_funky.mp3'))
  expect(tags).toMatchObject({
    TITLE: ['Testing 123'],
  })
})

test('should write track info to flac', async () => {
  await copyFile(path.join(testData, 'retro_funky.flac'), path.join(testData, 'tmp', 'retro_funky.flac'))

  await write({
    path: path.join(testData, 'tmp', 'retro_funky.flac'),
    filename: 'retro_funky.flac',
    durationSeconds: 123,
    title: 'Testing 123',
  })

  const tags = await taglib.readTags(path.join(testData, 'tmp', 'retro_funky.flac'))
  expect(tags).toMatchObject({
    TITLE: ['Testing 123'],
  })
})
