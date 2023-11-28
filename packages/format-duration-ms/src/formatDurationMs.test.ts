import { describe, test } from 'node:test'
import assert from 'node:assert'
import formatDurationMs from './formatDurationMs'

describe('formatDurationMs', () => {
  test('main', async () => {
    assert.strictEqual(formatDurationMs(-10), '-10ms')
    assert.strictEqual(formatDurationMs(10), '10ms')
    assert.strictEqual(formatDurationMs(1000), '1s')
    assert.strictEqual(formatDurationMs(1001), '1s')
    assert.strictEqual(formatDurationMs(100000), '1m40s')
    assert.strictEqual(formatDurationMs(10000000), '2h46m40s')
    assert.strictEqual(formatDurationMs(1000000000), '11d13h46m40s')
    assert.strictEqual(formatDurationMs(100000000000), '3y62d9h46m40s')
  })
})
