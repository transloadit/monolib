const fileExists = require('./fileExists')

describe('fileExists', () => {
  test('main', async () => {
    expect(await fileExists(`${__filename}`)).toMatch(true)
    expect(await fileExists(`${__filename}-nonexistant`)).toMatch(false)
  })
})
