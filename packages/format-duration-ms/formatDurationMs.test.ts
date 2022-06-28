// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'formatDura... Remove this comment to see the full error message
const formatDurationMs = require('./formatDurationMs')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('formatDurationMs', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(-10)).toBe('-10ms')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(10)).toBe('10ms')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(1000)).toBe('1s')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(1001)).toBe('1s')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(100000)).toBe('1m40s')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(10000000)).toBe('2h46m40s')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(1000000000)).toBe('11d13h46m40s')
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(formatDurationMs(100000000000)).toBe('3y62d9h46m40s')
  })
})
