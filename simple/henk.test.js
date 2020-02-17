const henk = require('./henk')

describe('henk', () => {
  test('henk', async () => {
    expect(henk().toMatch('henk'))
  })
})
