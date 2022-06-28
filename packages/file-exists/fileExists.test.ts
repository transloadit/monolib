// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fileExists... Remove this comment to see the full error message
const fileExists = require('./fileExists')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('fileExists', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect((await fileExists(`${__filename}`))).toBe(true)
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect((await fileExists(`${__filename}-nonexistant`))).toBe(false)
  })
})
