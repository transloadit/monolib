const prd = require('./prd')

describe('prd', () => {
  test('main', async () => {
    expect(prd('foo')).toStrictEqual(['foo', { exitCode: 1 }])
  })
})
