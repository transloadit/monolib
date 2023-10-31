import { mock, test, describe } from 'node:test'
import assert from 'node:assert/strict'
import prd from './prd'

describe('prd', () => {
  test('main', async () => {
    const mockExit = mock.method(process, 'exit', () => {})
    const mockConsoleErr = mock.method(console, 'error', () => {})

    prd('foo')

    assert.equal(mockExit.mock.calls[0].arguments[0], 1)
    assert.equal(mockConsoleErr.mock.calls[0].arguments[0].message, 'Halt via prd')
  })
})
