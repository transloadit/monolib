import assert from 'node:assert'
import { describe, mock, test } from 'node:test'
import { prd } from './prd'

describe('prd', () => {
  test('main', async () => {
    const mockExit = mock.method(process, 'exit', () => {})
    const mockConsoleErr = mock.method(console, 'error', () => {})

    prd('foo')

    assert.strictEqual(mockExit.mock.calls[0].arguments[0], 1)
    assert.strictEqual(mockConsoleErr.mock.calls[0].arguments[0].message, 'Halt via prd')
  })
})
