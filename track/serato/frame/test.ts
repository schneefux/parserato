import SeratoCueMarker from "./marker2/SeratoCueMarker"
import SeratoColorMarker from "./marker2/SeratoColorMarker"
import SeratoBpmLockMarker from "./marker2/SeratoBpmLockMarker"
import SeratoMarkers2Frame from "./SeratoMarkers2Frame"
import * as encoder from "./index"
import SeratoBeatGridFrame from "./SeratoBeatGridFrame"
import SeratoNonTerminalBeatGridMarker from "./beatgrid/SeratoNonTerminalBeatGridMarker"
import SeratoTerminalBeatGridMarker from "./beatgrid/SeratoTerminalBeatGridMarker"

const testFrameSeratoMarkers2 = Buffer.from('6170706c69636174696f6e2f6f637465742d73747265616d000053657261746f204d61726b657273320001014151464454307850556741414141414541502f2f2f304e56525141414141414e4141414141414141414d77414141414141454e56525141414141414e4141454141425a70414d79490a4141414141454e56525141414141414e41414d4141614a6a414d7a4d4141414141454a51545578505130734141414141415145410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex')
const testFrameSeratoBeatgrid = Buffer.from('YXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtAABTZXJhdG8gQmVhdEdyaWQAAQAAAAACP1PGUgAAAARAGTc+QxWTEgA=', 'base64')

test('should decode Serato Markers 2 frame', () => {
  const frame = encoder.decode(testFrameSeratoMarkers2)! as SeratoMarkers2Frame

  expect(frame).toBeDefined()
  expect(frame.id).toBe('Serato Markers2')
  expect(frame.data.length).toBe(5)

  const color0 = <SeratoColorMarker> frame.data[0]
  expect(color0.color).toBe('#ffffff')

  const cue0 = <SeratoCueMarker> frame.data[1]
  expect(cue0.id).toBe('CUE')
  expect(cue0.index).toBe(0)
  expect(cue0.milliseconds).toBe(0)
  expect(cue0.color).toBe('#cc0000')

  expect(frame.data[2].id).toBe('CUE')
  expect(frame.data[3].id).toBe('CUE')
  expect(frame.data[4].id).toBe('BPMLOCK')
  expect((<SeratoBpmLockMarker> frame.data[4]).isActive).toBeTruthy()
})

test('should encode to Serato Makers 2 frame', () => {
  const frame = new SeratoMarkers2Frame()

  frame.data.push(Object.assign(new SeratoColorMarker(), {
    id: 'COLOR',
    size: 4,
    color: '#ffffff',
  }))

  frame.data.push(Object.assign(new SeratoCueMarker(), {
    id: 'CUE',
    index: 0,
    milliseconds: 0,
    color: '#cc0000',
    name: '',
  }))

  frame.data.push(Object.assign(new SeratoCueMarker(), {
    id: 'CUE',
    index: 1,
    milliseconds: 5737,
    color: '#cc8800',
    name: '',
  }))

  frame.data.push(Object.assign(new SeratoCueMarker(), {
    id: 'CUE',
    index: 3,
    milliseconds: 107107,
    color: '#cccc00',
    name: '',
  }))

  frame.data.push(Object.assign(new SeratoBpmLockMarker(), {
    id: 'BPMLOCK',
    size: 1,
    isActive: true,
  }))

  expect(encoder.encode(frame).toString('hex')).toBe(testFrameSeratoMarkers2.toString('hex'))
})

test('should decode Serato BeatGrid frame', () => {
  const frame = encoder.decode(testFrameSeratoBeatgrid)! as SeratoBeatGridFrame

  expect(frame).toBeDefined()
  expect(frame.id).toBe('Serato BeatGrid')
  expect(frame.size).toBe(23)

  expect(frame.data.length).toBe(2)
  expect(frame.data[0]).toBeInstanceOf(SeratoNonTerminalBeatGridMarker)
  expect(frame.data[1]).toBeInstanceOf(SeratoTerminalBeatGridMarker)

  const nonTerminal = frame.data[0] as SeratoNonTerminalBeatGridMarker
  expect(nonTerminal.position).toBe(0.8272448778152466)
  expect(nonTerminal.beatsTillNext).toBe(4)

  const terminal = frame.data[1] as SeratoTerminalBeatGridMarker
  expect(terminal.position).toBe(2.3939967155456543)
  expect(terminal.bpm).toBe(149.57449340820312)
})

test('should encode to Serato Makers 2 frame', () => {
  const frame = new SeratoBeatGridFrame()

  frame.data.push(Object.assign(new SeratoNonTerminalBeatGridMarker(), {
    position: 0.8272448778152466,
    beatsTillNext: 4,
  }))

  frame.data.push(Object.assign(new SeratoTerminalBeatGridMarker(), {
    position: 2.3939967155456543,
    bpm: 149.57449340820312,
  }))

  expect(encoder.encode(frame).toString('hex')).toBe(testFrameSeratoBeatgrid.toString('hex'))
})
