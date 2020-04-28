const replaceMe = require('./replaceMe')

describe('replaceMe', () => {
  test('main', async () => {
    expect(replaceMe('foo')).toBe('bar')
  })
})
