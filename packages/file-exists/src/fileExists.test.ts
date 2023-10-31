import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fileExists from './fileExists'

describe('fileExists', () => {
  test('main', async () => {
    assert.equal(await fileExists(`${__filename}`), true)
    assert.equal(await fileExists(`${__filename}-nonexistant`), false)
  })
})
