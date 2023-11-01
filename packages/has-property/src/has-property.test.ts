import { hasProperty } from './has-property'

test('hasProperty', () => {
  expect(hasProperty({ foo: 'bar' }, 'foo')).toBe(true)
  expect(hasProperty({ foo: 'bar' }, 'bar')).toBe(false)
  expect(hasProperty({ foo: 'bar' }, 'constructor')).toBe(false)
  expect(hasProperty('foo', 'foo')).toBe(false)
})
