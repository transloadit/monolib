// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const prd = require('./prd')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('prd', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    jest.spyOn(console, 'error').mockImplementation((e: any) => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(e.message).toStrictEqual('Halt via prd')
    })
    prd('foo')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
