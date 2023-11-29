import { describe, test } from 'node:test'
import assert from 'node:assert'
import fileExists from './fileExists'

describe('fileExists', () => {
  test('main', async () => {
    assert.strictEqual(await fileExists(`${__filename}`), true)
    assert.strictEqual(await fileExists(`${__filename}-nonexistant`), false)
  })
})
