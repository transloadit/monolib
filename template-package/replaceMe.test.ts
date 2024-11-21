import assert from 'node:assert'
import { describe, test } from 'node:test'
import { replaceMe } from './replaceMe'

describe('replaceMe', () => {
  test('main', async () => {
    assert.equal(replaceMe('foo'), 'bar')
  })
})
