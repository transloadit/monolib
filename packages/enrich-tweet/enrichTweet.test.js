const enrichTweet = require('./enrichTweet')

describe('enrichTweet', () => {
  test('main', async () => {
    expect((await enrichTweet({ full_text: 'foo' }))).toBe('foo')
  })
})
