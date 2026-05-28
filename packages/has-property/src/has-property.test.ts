import assert from 'node:assert'
import { test } from 'node:test'
import { hasProperty } from './has-property.ts'

test('hasProperty', () => {
  assert.ok(hasProperty({ foo: 'bar' }, 'foo'))
  assert.strictEqual(hasProperty({ foo: 'bar' }, 'bar'), false)
  assert.strictEqual(hasProperty({ foo: 'bar' }, 'constructor'), false)
  assert.strictEqual(hasProperty('foo', 'foo'), false)
})
