import prd from './prd'

describe('prd', () => {
  test('main', async () => {
    // @ts-expect-error
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation((e: any) => {
      expect(e.message).toStrictEqual('Halt via prd')
    })
    prd('foo')
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
