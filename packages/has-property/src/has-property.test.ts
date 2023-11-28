import { test } from 'node:test'
import assert from 'node:assert'
import { hasProperty } from './has-property'

test('hasProperty', () => {
  assert.ok(hasProperty({ foo: 'bar' }, 'foo'))
  assert.strictEqual(hasProperty({ foo: 'bar' }, 'bar'), false)
  assert.strictEqual(hasProperty({ foo: 'bar' }, 'constructor'), false)
  assert.strictEqual(hasProperty('foo', 'foo'), false)
})
