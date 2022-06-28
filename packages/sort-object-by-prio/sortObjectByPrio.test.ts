// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortObject... Remove this comment to see the full error message
const sortObjectByPrio = require('./sortObjectByPrio')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('sortObjectByPrio', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Object.keys(sortObjectByPrio({
      generated_upload_required: true,
      title                    : 'Automatic Face Detection Service',
      run_instructions         : 'Please upload an image with faces to run the demo.',
      redirect_from            : '/demos/image-manipulation/detect-faces-in-images/',
      generated_hash           : '136d8a55e5aedae8071b12378cbfc851',
    }, {
      _: [
        'redirect_to',
        'warning',
        'title',
        'meta_description',
      ],
      z: [
        /^generated_/,
      ],
    }))).toStrictEqual([
      'title',
      'redirect_from',
      'run_instructions',
      'generated_hash',
      'generated_upload_required',
    ])
  })
})
