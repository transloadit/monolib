import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import pr from './pr'

describe('pr', () => {
  test('main', async () => {
    assert.deepStrictEqual(pr('foo'), ['foo'])
  })
})
