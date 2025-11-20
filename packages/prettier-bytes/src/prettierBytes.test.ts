import assert from 'node:assert'
import { describe, it } from 'node:test'
import { prettierBytes } from './prettierBytes'

const testData: [number, string, string, string, string][] = [
  [2, '2 B', '2 B', '0.0 MB', '0.00 TB'],
  [9, '9 B', '9 B', '0.0 MB', '0.00 TB'],
  [25, '25 B', '25 B', '0.0 MB', '0.00 TB'],
  [235, '235 B', '235 B', '0.0 MB', '0.00 TB'],
  [2335, '2.3 KB', '2335 B', '0.0 MB', '0.00 TB'],
  [23552, '23 KB', '23552 B', '0.0 MB', '0.00 TB'],
  [235520, '230 KB', '235520 B', '0.2 MB', '0.00 TB'],
  [2355520, '2.2 MB', '2355520 B', '2.2 MB', '0.00 TB'],
  [23555520, '22 MB', '23555520 B', '22 MB', '0.00 TB'],
  [235555520, '225 MB', '235555520 B', '225 MB', '0.00 TB'],
  [2355555520, '2.19 GB', '2355555520 B', '2246 MB', '0.00 TB'],
  [23555555520, '21.94 GB', '23555555520 B', '22464 MB', '0.02 TB'],
  [235556555520, '219.38 GB', '235556555520 B', '224644 MB', '0.21 TB'],
  [2355556655520, '2.14 TB', '2355556655520 B', '2246434 MB', '2.14 TB'],
  [23555566655520, '21.44 TB', '23555566655520 B', '22464339 MB', '21.44 TB'],
  [235555566665520, '214.37 TB', '235555566665520 B', '224643294 MB', '214.37 TB'],
]

describe('prettierBytes', () => {
  for (const [input, expected, expectedB, expectedMB, expectedTB] of testData) {
    it(`should convert ${input} to ${expected}`, () => {
      assert.strictEqual(prettierBytes(input), expected)
    })

    it(`should convert ${input} to ${expectedB}`, () => {
      assert.strictEqual(prettierBytes(input, 'B'), expectedB)
    })

    it(`should convert ${input} to ${expectedMB}`, () => {
      assert.strictEqual(prettierBytes(input, 'MB'), expectedMB)
    })

    it(`should convert ${input} to ${expectedTB}`, () => {
      assert.strictEqual(prettierBytes(input, 'TB'), expectedTB)
    })
  }

  it('throws on non-number', () => {
    assert.throws(() => {
      // @ts-expect-error - testing invalid input
      prettierBytes('this is a string')
    })
  })

  it('throws on NaN', () => {
    assert.throws(() => {
      prettierBytes(Number.NaN)
    })
  })
})
