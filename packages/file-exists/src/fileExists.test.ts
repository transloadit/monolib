import fileExists from './fileExists'

describe('fileExists', () => {
  test('main', async () => {
    expect(await fileExists(`${__filename}`)).toBe(true)
    expect(await fileExists(`${__filename}-nonexistant`)).toBe(false)
  })
})
