// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortObject... Remove this comment to see the full error message
const sortObject = require('./sortObject')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('sortObject', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Object.keys(sortObject({
      generated_upload_required: true,
      title                    : 'Automatic Face Detection Service',
      run_instructions         : 'Please upload an image with faces to run the demo.',
      redirect_from            : '/demos/image-manipulation/detect-faces-in-images/',
      generated_hash           : '136d8a55e5aedae8071b12378cbfc851',
    }))).toStrictEqual([
      'generated_hash',
      'generated_upload_required',
      'redirect_from',
      'run_instructions',
      'title',
    ])
  })
})
