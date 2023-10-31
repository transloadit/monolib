import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import slugify from './slugify'

describe('slugify', () => {
  test('main', async () => {
    assert.equal(slugify(undefined), undefined)
    assert.equal(slugify(false), false)
    assert.equal(slugify(-10), -10)
    assert.equal(slugify('--This is My App !~'), 'this-is-my-app')
  })
})
