// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prettierBy... Remove this comment to see the full error message
const prettierBytes = require('./prettierBytes')

const testData = [
  [2, '2 B'],
  [9, '9 B'],
  [25, '25 B'],
  [235, '235 B'],
  [2335, '2.3 KB'],
  [23552, '23 KB'],
  [235520, '230 KB'],
  [2355520, '2.2 MB'],
  [23555520, '22 MB'],
  [235555520, '225 MB'],
  [2355555520, '2.2 GB'],
  [23555555520, '22 GB'],
  [235556555520, '219 GB'],
  [2355556655520, '2.1 TB'],
  [23555566655520, '21 TB'],
  [235555566665520, '214 TB'],
]

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('prettierBytes', () => {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should convert the specified number of bytes to a human-readable string like 236 MB', () => {
    testData.forEach((data) => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(prettierBytes(data[0])).toEqual(data[1])
    })
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws on non-number', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(() => {
      prettierBytes('this is a string')
    }).toThrow()
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws on NaN', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(() => {
      prettierBytes(NaN)
    }).toThrow()
  })
})
