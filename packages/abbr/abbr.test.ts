// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const abbr = require('./abbr')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('abbr', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(abbr('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ')).toBe('Lorem ipsum dolor sit ame[...] et dolore magna aliqua. ')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(abbr('Lorem ipsum dolor sit amet', 10, ' .. ')).toBe('Lor .. met')
  })
})
