// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const replaceMe = require('./replaceMe')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('replaceMe', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(replaceMe('foo')).toBe('bar')
  })
})
