const slugify = require('./slugify')

describe('slugify', () => {
  test('main', async () => {
    expect(slugify(undefined)).toBe(undefined)
    expect(slugify(false)).toBe(false)
    expect(slugify(-10)).toBe(-10)
    expect(slugify('--This is My App !~')).toBe('this-is-my-app')
  })
})
