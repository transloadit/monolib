import replaceMe from './replaceMe'

describe('replaceMe', () => {
  test('main', async () => {
    expect(replaceMe('foo')).toBe('bar')
  })
})
