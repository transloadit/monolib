import pr from './pr'

describe('pr', () => {
  test('main', async () => {
    expect(pr('foo')).toStrictEqual(['foo'])
  })
})
