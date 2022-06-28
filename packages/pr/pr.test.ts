const pr = require('./pr')

describe('pr', () => {
  test('main', async () => {
    expect(pr('foo')).toStrictEqual(['foo'])
  })
})
