import prd from './prd'

describe('prd', () => {
  test('main', async () => {
    const mockExit = jest
      .spyOn(process, 'exit')
      // @ts-expect-error - process.exit should return never but that is impossible here
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation((code?: number) => {})
    jest.spyOn(console, 'error').mockImplementation((e: Error) => {
      expect(e.message).toStrictEqual('Halt via prd')
    })
    prd('foo')
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
