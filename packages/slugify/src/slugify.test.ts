import assert from 'node:assert'
import { describe, test } from 'node:test'
import slugify from './slugify'

describe('slugify', () => {
  test('main', async () => {
    // @ts-expect-error - testing invalid input
    assert.strictEqual(slugify(undefined), undefined)
    // @ts-expect-error - testing invalid input
    assert.strictEqual(slugify(false), false)
    // @ts-expect-error - testing invalid input
    assert.strictEqual(slugify(-10), -10)
    assert.strictEqual(slugify('--This is My App !~'), 'this-is-my-app')
  })
})
