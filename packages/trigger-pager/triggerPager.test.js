const triggerPager = require('./triggerPager')

describe('triggerPager', () => {
  test('main', async () => {
    expect(triggerPager('foo')).toBe('bar')
  })
})
