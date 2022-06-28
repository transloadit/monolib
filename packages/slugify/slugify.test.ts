// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'slugify'.
const slugify = require('./slugify')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('slugify', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(slugify(undefined)).toBe(undefined)
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(slugify(false)).toBe(false)
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(slugify(-10)).toBe(-10)
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(slugify('--This is My App !~')).toBe('this-is-my-app')
  })
})
