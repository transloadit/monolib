const prd = require('./prd')

describe('prd', () => {
  test('main', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation((e) => {
      expect(e.message).toStrictEqual('Halt via prd')
    })
    prd('foo')
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
