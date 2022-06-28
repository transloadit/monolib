// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pr'.
const pr = require('./pr')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('pr', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(pr('foo')).toStrictEqual(['foo'])
  })
})
