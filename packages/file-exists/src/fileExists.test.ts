import assert from 'node:assert'
import { describe, test } from 'node:test'
import { fileExists } from './fileExists.ts'

describe('fileExists', () => {
  test('main', async () => {
    assert.strictEqual(await fileExists(import.meta.filename), true)
    assert.strictEqual(await fileExists(`${import.meta.filename}-nonexistant`), false)
  })
})
