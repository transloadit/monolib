import assert from 'node:assert'
import { describe, test } from 'node:test'
import pr from './pr'

describe('pr', () => {
  test('main', async () => {
    assert.deepStrictEqual(pr('foo'), ['foo'])
  })
})
