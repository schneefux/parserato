import { decode, encode } from "./index"
import SeratoTerminalBeatGridMarker from "./frame/beatgrid/SeratoTerminalBeatGridMarker"

const testId3Tags = {
  "Serato Analysis": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgE=",
  "Serato Autotags": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQExMTUuMDAALTMuMjUxADAuMDAwAA==",
  "Serato BeatGrid": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAACP1PGUgAAAARAGTc+QxWTEgA=",
  "Serato Markers2": "YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAABBUUZEVlVVQUFBQUFEUUFFQUFHNUdBQUF6QUFBQUFCRFZVVUFBQUFBRFFBRkFBQ2RWd0RNQU13QUFBQkRWVVVBQUFBQURRQUgKQUFLb2R3Q0lBTXdBQUFBQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  /* "Serato Offsets_": "...", */
  /* "Serato Overview": "...", */
}

const testFlacTag = {
  SERATO_ANALYSIS: [ 'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQW5hbHlzaXMAAgEA' ],
  SERATO_AUTOGAIN: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQXV0b3RhZ3MAAQE4Ny41MAAtNi44\n' +
      'MjEAMC4wMDAAA'
  ],
  SERATO_BEATGRID: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAACP1PGUgAAAARAGTc+QxWTEgA=',
  ],
  SERATO_MARKERS_V2: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVDB4UFVn\n' +
      'QUFBQUFFQVAvLy8wTlZSUUFBQUFBTkFBQUFBQlZxQU13QUFBQUFBRU5WUlFBQUFBQU5BQUVB\n' +
      'QWt0T0FBQUEKekFBQUFFSlFUVXhQUTBzQUFBQUFBUUFBAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n' +
      'AAAAAAAAAAAAAAAAAAAAA='
  ],
  // SERATO_OVERVIEW: ommitted
  SERATO_PLAYCOUNT: [ '2' ],
  SERATO_RELVOL: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gUmVsVm9sQWQAAQEBAAAA'
  ],
  SERATO_VIDEO_ASSOC: [
    'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gVmlkQXNzb2MAAQEBAAAA'
  ],
}

const markers2WithCues = 'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVDB4UFVnQUFBQUFFQVAvLy8wTlZSUUFBQUFBTkFBQUFBQlZxQU13QUFBQUFBRU5WUlFBQUFBQU5BQUVBQWt0T0FBQUEKekFBQUFFSlFUVXhQUTBzQUFBQUFBUUFBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
const markers2NoCues   = 'YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gTWFya2VyczIAAQFBUUZEVDB4UFVnQUFBQUFFQVAvLy8wSlFUVXhQUTBzQUFBQUFBUUFBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
// TODO last footer byte is not always 0 - this BeatGrid tag was found in the wild ending with `...AAAz`
const beatgrid1 = Buffer.from('YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAABPTw+gkKWAAAA', 'base64')

test('should deserialize track info from ID3', () => {
  const geobTags = [...Object.values(testId3Tags)]
    .reduce((obj, t, index) => ({ ...obj, [index]: Buffer.from(t, 'base64') }), {})
  const trackInfo = decode(geobTags)

  expect(trackInfo.cues).toMatchObject([
    { index: 4, color: '#00cc00', milliseconds: 112920 },
    { index: 5, color: '#cc00cc', milliseconds: 40279 },
    { index: 7, color: '#8800cc', milliseconds: 174199 },
  ])
  expect(trackInfo.beatgridMarkers).toMatchObject([
    { position: 0.8272448778152466, bpm: 153.1831616343679 },
    { position: 2.3939967155456543, bpm: 149.57449340820312 },
  ])
})

test('should deserialize track info from FLAC', () => {
  const geobTags = [
    testFlacTag['SERATO_ANALYSIS'],
    testFlacTag['SERATO_AUTOGAIN'],
    testFlacTag['SERATO_BEATGRID'],
    testFlacTag['SERATO_MARKERS_V2'],
    testFlacTag['SERATO_RELVOL'],
    testFlacTag['SERATO_VIDEO_ASSOC'],
  ].reduce((obj, t, index) => ({ ...obj, [index]: Buffer.from(t[0], 'base64') }), {})
  const trackInfo = decode(geobTags)

  expect(trackInfo.cues).toMatchObject([
    { index: 0, color: '#cc0000', milliseconds: 5482 },
    { index: 1, color: '#0000cc', milliseconds: 150350 },
  ])
  expect(trackInfo.beatgridMarkers).toMatchObject([
    { position: 0.8272448778152466, bpm: 153.1831616343679 },
    { position: 2.3939967155456543, bpm: 149.57449340820312 },
  ])
})

test('should deserialize track info from markers2 without cues', () => {
  const trackInfo = decode({
    'Serato Markers2': Buffer.from(markers2NoCues, 'base64'),
  })

  expect(trackInfo.cues).toBeDefined()
  expect(trackInfo.cues!.length).toBe(0)
  expect(trackInfo.bpmLock).toBeFalsy()
  expect(trackInfo.color).toBe('#ffffff')
})

test('should deserialize track info from 1 beatgrid marker', () => {
  const trackInfo = decode({
    'Serato BeatGrid': beatgrid1,
  })

  expect(trackInfo.beatgridMarkers).toBeDefined()
  expect(trackInfo.beatgridMarkers!.length).toBe(1)
})

test('should serialize track info with cues', () => {
  const cues = [
    { index: 0, color: '#cc0000', milliseconds: 5482, name: '' },
    { index: 1, color: '#0000cc', milliseconds: 150350, name: '' },
  ]
  const map = encode({ cues })

  expect(map['Serato Markers2'].toString('base64')).toBe(markers2WithCues)
})

test('should serialize track info with beatgrid markers', () => {
  const beatgridMarkers = [
    { position: 0.8272448778152466, bpm: 153.1831616343679 },
    { position: 2.3939967155456543, bpm: 149.57449340820312 },
  ]
  const map = encode({ beatgridMarkers })

  expect(map['Serato BeatGrid'].toString('base64')).toBe(testId3Tags['Serato BeatGrid'])
})

test('should serialize track info without cues', () => {
  const map = encode({
    cues: [],
    bpmLock: false,
    color: '#ffffff',
  })

  expect(map['Serato Markers2'].toString('base64')).toBe(markers2NoCues)
})

test('should use defaults when serializing track with partial markers2 info', () => {
  const map = encode({
    bpmLock: false,
  })

  expect(map['Serato Markers2'].toString('base64')).toBe(markers2NoCues)
})

test('should serialize track info with 1 beatgrid marker', () => {
  const map = encode({
    beatgridMarkers: [
      Object.assign(new SeratoTerminalBeatGridMarker(), {
        position: 0.04595804959535599,
        bpm: 75,
      })
    ]
  })

  expect(map['Serato BeatGrid'].toString('hex')).toBe(beatgrid1.toString('hex'))
})

test('should not serialize track info with 0 beatgrid markers', () => {
  expect(() => encode({ beatgridMarkers: [] })).toThrow(/must/)
})
